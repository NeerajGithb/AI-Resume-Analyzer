export interface ProgressStage {
  name: string;
  duration: number;
  progress: number;
}

export type OnStageCallback<T extends string = string> = (stage: T, progress: number) => void;

export class ProgressHelper<TStage extends string = string> {
  private aborted = false;

  constructor(
    private readonly onStage: OnStageCallback<TStage>,
    private readonly signal?: AbortSignal
  ) {
    if (signal) {
      signal.addEventListener('abort', () => {
        this.aborted = true;
      });
    }
  }

  /**
   * Runs fake stage progress in parallel with the real API call.
   *
   * Key fix: progress animation now runs UP TO the second-to-last stage only.
   * After the API resolves, we complete remaining stages + finalizing smoothly
   * instead of jumping straight to the end.
   */
  async run<TResult>(
    stages: TStage[],
    apiCall: () => Promise<TResult>,
    stageDurations?: number[]
  ): Promise<TResult> {
    const durations = stageDurations ?? this.getDefaultDurations(stages.length);

    // Animate only up to (but not including) the last stage while API is in-flight.
    // This prevents the "reset then jump to end" glitch when API finishes early.
    const preStages  = stages.slice(0, -1);   // all except last
    const finalStage = stages[stages.length - 1]; // last real stage

    // Fire API immediately
    const apiPromise = apiCall();

    // Animate pre-stages in parallel
    const preProgressPromise = (async () => {
      for (let i = 0; i < preStages.length; i++) {
        if (this.isAborted()) throw new DOMException('Operation cancelled', 'AbortError');

        const pct = this.stagePercent(i, stages.length);
        this.onStage(preStages[i], pct);

        // Tick sub-progress within the stage for the active progress bar
        await this.tickStage(durations[i] ?? 1200);
      }
    })();

    // Wait for BOTH api + pre-stages before moving to final stage
    const [result] = await Promise.all([apiPromise, preProgressPromise]);

    // Now animate final stage smoothly
    if (!this.isAborted()) {
      this.onStage(finalStage, this.stagePercent(stages.length - 1, stages.length));
      await this.tickStage(durations[stages.length - 1] ?? 800);
    }

    // Finalizing micro-step
    if (!this.isAborted()) {
      this.onStage('finalizing' as TStage, 98);
      await this.delay(400);
    }

    return result;
  }

  async runSimple<TResult>(apiCall: () => Promise<TResult>): Promise<TResult> {
    return await apiCall();
  }

  // ── Tick sub-progress 0→100 within a single stage ─────────────────────────
  private async tickStage(totalMs: number): Promise<void> {
    const ticks    = 20;
    const interval = totalMs / ticks;

    for (let t = 1; t <= ticks; t++) {
      if (this.isAborted()) return;
      await this.delay(interval);
    }
  }

  private stagePercent(index: number, total: number): number {
    return Math.round(((index + 1) / total) * 90); // cap at 90, finalizing gets 98
  }

  private isAborted(): boolean {
    return this.aborted || this.signal?.aborted === true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getDefaultDurations(stageCount: number): number[] {
    return Array.from({ length: stageCount }, (_, i) =>
      i === 0 ? 800 : 1200 + Math.random() * 400
    );
  }

  private getProgressPercentages(stageCount: number): number[] {
    return Array.from({ length: stageCount }, (_, i) =>
      Math.round(((i + 1) / stageCount) * 90)
    );
  }
}

export const PROGRESS_PRESETS = {
  STANDARD:  ['uploading', 'parsing', 'processing', 'finalizing'],
  ANALYSIS:  ['uploading', 'parsing', 'scoring', 'keywords', 'suggestions', 'finalizing'],
  MATCH:     ['uploading', 'parsing', 'matching', 'finalizing'],
  COMPARE:   ['uploading', 'parsing', 'comparing', 'finalizing'],
  GENERATE:  ['uploading', 'parsing', 'generating', 'finalizing'],
  SHORT:     ['uploading', 'processing', 'finalizing'],
} as const;