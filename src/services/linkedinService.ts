import { http, ApiError } from '@/lib/httpClient';
import { LinkedInResult, LinkedInStage, SSEEvent } from '@/types';
import { API_BASE_URL } from '@/lib/constants';

export type OnStage = (stage: LinkedInStage, progress: number) => void;

const STAGE_ORDER: LinkedInStage[] = ['uploading', 'parsing', 'scoring', 'finalizing'];

function stageProgress(stage: LinkedInStage): number {
  const idx = STAGE_ORDER.indexOf(stage);
  return idx === -1 ? 0 : Math.round(((idx + 1) / STAGE_ORDER.length) * 100);
}

/**
 * Analyzes LinkedIn profile text via SSE streaming.
 */
export async function analyzeLinkedInProfile(
  profileText: string,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<LinkedInResult> {
  const response = await fetch(`${API_BASE_URL}/linkedin/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileText }),
    signal,
  });

  if (!response.ok) {
    const requestId = response.headers.get('x-request-id') ?? undefined;
    let message = 'LinkedIn analysis failed';
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
        const stage = event.stage as LinkedInStage;
        onStage(stage, stageProgress(stage));
      } else if (event.status === 'complete') {
        completed = true;
        return event.data as unknown as LinkedInResult;
      } else if (event.status === 'error') {
        throw new ApiError(502, event.message ?? 'LinkedIn analysis failed on server');
      }
    }
  }

  if (!completed) {
    throw new ApiError(502, 'Connection closed before analysis completed. Please try again.');
  }

  throw new ApiError(500, 'Unexpected end of stream');
}

