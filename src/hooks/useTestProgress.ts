import { useAnalysisStore } from '@/store/analysisUIStore';

const STAGES = [
  'uploading',
  'parsing',
  'scoring',
  'keywords',
  'suggestions',
  'finalizing',
] as const;

// Realistic stage durations in milliseconds
const STAGE_DURATIONS = {
  uploading: 2000,    // Quick upload
  parsing: 3500,      // Slower parsing
  scoring: 4000,      // Complex scoring
  keywords: 3000,     // Moderate keyword analysis
  suggestions: 5000,  // Longest - AI generating suggestions
  finalizing: 1500,   // Quick finalization
};

/**
 * Hook to test GlobalProgress component without calling the API
 * Usage: const { startTest, stopTest } = useTestProgress();
 */
export function useTestProgress() {
  const { setStageProgress, reset } = useAnalysisStore();

  const startTest = () => {
    reset();
    let currentStageIndex = 0;
    let currentProgress = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined = undefined;

    const runStage = () => {
      if (currentStageIndex >= STAGES.length) {
        setTimeout(() => reset(), 800);
        return;
      }

      const stage = STAGES[currentStageIndex];
      const duration = STAGE_DURATIONS[stage];
      const updateInterval = 50; // Update every 50ms for smooth animation
      const totalUpdates = duration / updateInterval;
      const progressIncrement = 100 / totalUpdates;

      currentProgress = 0;

      intervalId = setInterval(() => {
        currentProgress += progressIncrement;

        if (currentProgress >= 100) {
          currentProgress = 100;
          setStageProgress(stage, 100);
          clearInterval(intervalId);
          
          // Brief pause before next stage
          setTimeout(() => {
            currentStageIndex++;
            runStage();
          }, 300);
        } else {
          // Add slight randomness to make it feel more realistic
          const jitter = (Math.random() - 0.5) * 2;
          const adjustedProgress = Math.min(100, Math.max(0, currentProgress + jitter));
          setStageProgress(stage, Math.floor(adjustedProgress));
        }
      }, updateInterval);
    };

    runStage();

    return intervalId;
  };

  const stopTest = () => {
    reset();
  };

  return { startTest, stopTest };
}
