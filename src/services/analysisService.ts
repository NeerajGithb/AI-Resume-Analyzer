import { http, ApiError } from '@/lib/httpClient';
import { AnalysisResult, AnalysisStage, SSEEvent } from '@/types';

export type OnStage = (stage: AnalysisStage, progress: number) => void;

const STAGE_ORDER: AnalysisStage[] = ['uploading', 'parsing', 'scoring', 'keywords', 'suggestions', 'finalizing'];

function stageProgress(stage: AnalysisStage): number {
  const idx = STAGE_ORDER.indexOf(stage);
  return idx === -1 ? 0 : Math.round(((idx + 1) / STAGE_ORDER.length) * 100);
}

/**
 * Uploads the resume file, consumes the SSE stream, and returns the final result.
 * Calls `onStage` on each progress event so the store can update UI state.
 * Throws `ApiError` on HTTP errors or server-side failures.
 */
export async function run(
  file: File,
  signal: AbortSignal,
  onStage: OnStage,
  yearsOfExperience?: string,
  targetRole?: string,
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('resume', file);
  if (yearsOfExperience) {
    formData.append('yearsOfExperience', yearsOfExperience);
  }
  if (targetRole) {
    formData.append('targetRole', targetRole);
  }

  const response = await http.stream('/analyze', formData, signal);

  if (!response.ok) {
    const requestId = response.headers.get('x-request-id') ?? undefined;
    let message = 'Upload failed';
    try {
      const body = (await response.json()) as { message?: string };
      message = body.message ?? message;
    } catch { /* ignore */ }
    throw new ApiError(response.status, message, requestId);
  }

  if (!response.body) {
    throw new ApiError(response.status || 500, 'Server returned no response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completed = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const line = part.trim();
      if (line.startsWith(':')) continue;       // heartbeat comment
      if (!line.startsWith('data:')) continue;

      const json = line.slice('data:'.length).trim();
      if (!json) continue;

      let event: SSEEvent;
      try {
        event = JSON.parse(json) as SSEEvent;
      } catch {
        continue; // malformed line — skip
      }

      if (event.status === 'analyzing') {
        onStage(event.stage as AnalysisStage, stageProgress(event.stage as AnalysisStage));
      } else if (event.status === 'complete') {
        completed = true;
        return event.data;
      } else if (event.status === 'error') {
        throw new ApiError(502, event.message ?? 'Analysis failed on server');
      }
    }
  }

  if (!completed) {
    throw new ApiError(502, 'Connection closed before analysis completed. Please try again.');
  }

  // Unreachable but satisfies TypeScript
  throw new ApiError(500, 'Unexpected end of stream');
}

