import { http, ApiError } from '@/lib/httpClient';
import { CompareResult, CompareStage, SSEEvent } from '@/types';

export type OnStage = (stage: CompareStage, progress: number) => void;

const STAGE_ORDER: CompareStage[] = ['uploading', 'parsing', 'comparing', 'finalizing'];

function stageProgress(stage: CompareStage): number {
  const idx = STAGE_ORDER.indexOf(stage);
  return idx === -1 ? 0 : Math.round(((idx + 1) / STAGE_ORDER.length) * 100);
}

/**
 * Compares two resumes via SSE streaming.
 */
export async function compareResumes(
  resume1: File,
  resume2: File,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<CompareResult> {
  const formData = new FormData();
  formData.append('resume1', resume1);
  formData.append('resume2', resume2);

  const response = await http.stream('/compare', formData, signal);

  if (!response.ok) {
    const requestId = response.headers.get('x-request-id') ?? undefined;
    let message = 'Comparison failed';
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
      if (line.startsWith(':')) continue;
      if (!line.startsWith('data:')) continue;

      const json = line.slice('data:'.length).trim();
      if (!json) continue;

      let event: SSEEvent;
      try {
        event = JSON.parse(json) as SSEEvent;
      } catch {
        continue;
      }

      if (event.status === 'analyzing') {
        const stage = event.stage as CompareStage;
        onStage(stage, stageProgress(stage));
      } else if (event.status === 'complete') {
        completed = true;
        return event.data as unknown as CompareResult;
      } else if (event.status === 'error') {
        throw new ApiError(502, event.message ?? 'Comparison failed on server');
      }
    }
  }

  if (!completed) {
    throw new ApiError(502, 'Connection closed before comparison completed. Please try again.');
  }

  throw new ApiError(500, 'Unexpected end of stream');
}

