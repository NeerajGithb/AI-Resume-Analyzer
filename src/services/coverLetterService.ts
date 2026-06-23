import { http, ApiError } from '@/lib/httpClient';
import { CoverLetterResult, CoverLetterStage, SSEEvent } from '@/types';

export type OnStage = (stage: CoverLetterStage, progress: number) => void;

const STAGE_ORDER: CoverLetterStage[] = ['uploading', 'parsing', 'generating', 'finalizing'];

function stageProgress(stage: CoverLetterStage): number {
  const idx = STAGE_ORDER.indexOf(stage);
  return idx === -1 ? 0 : Math.round(((idx + 1) / STAGE_ORDER.length) * 100);
}

/**
 * Generates cover letter via SSE streaming.
 */
export async function generateCoverLetter(
  resume: File,
  jobDescription: string,
  companyName: string,
  tone: 'professional' | 'enthusiastic' | 'formal' | 'conversational',
  signal: AbortSignal,
  onStage: OnStage,
): Promise<CoverLetterResult> {
  const formData = new FormData();
  formData.append('resume', resume);
  formData.append('jobDescription', jobDescription);
  formData.append('companyName', companyName);
  formData.append('tone', tone);

  const response = await http.stream('/cover-letter/generate', formData, signal);

  if (!response.ok) {
    const requestId = response.headers.get('x-request-id') ?? undefined;
    let message = 'Cover letter generation failed';
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
        const stage = event.stage as CoverLetterStage;
        onStage(stage, stageProgress(stage));
      } else if (event.status === 'complete') {
        completed = true;
        return event.data as unknown as CoverLetterResult;
      } else if (event.status === 'error') {
        throw new ApiError(502, event.message ?? 'Cover letter generation failed on server');
      }
    }
  }

  if (!completed) {
    throw new ApiError(502, 'Connection closed before generation completed. Please try again.');
  }

  throw new ApiError(500, 'Unexpected end of stream');
}

