import axiosInstance from '@/lib/api/baseService';
import type {
  SkillSuggestionRequest,
  SkillSuggestionResponse,
  SkillCategorizationRequest,
  SkillCategorizationResponse,
  ProjectBulletsRequest,
  ProjectBulletsResponse,
  ResumeBuilderFormData,
} from '@/types/resumeBuilder';

// ─── Suggest skills for a role ────────────────────────────────────────────────

export async function suggestSkills(
  payload: SkillSuggestionRequest,
): Promise<SkillSuggestionResponse> {
  const res = await axiosInstance.post<SkillSuggestionResponse>('/builder-v2/suggest-skills', payload);
  return res.data;
}

// ─── Categorize selected skills ───────────────────────────────────────────────

export async function categorizeSkills(
  payload: SkillCategorizationRequest,
): Promise<SkillCategorizationResponse> {
  const res = await axiosInstance.post<SkillCategorizationResponse>('/builder-v2/categorize-skills', payload);
  return res.data;
}

// ─── Generate project bullets ─────────────────────────────────────────────────

export async function generateProjectBullets(
  payload: ProjectBulletsRequest,
): Promise<ProjectBulletsResponse> {
  const res = await axiosInstance.post<ProjectBulletsResponse>('/builder-v2/generate-bullets', payload);
  return res.data;
}

// ─── Generate resume (full submission) ───────────────────────────────────────

export interface GenerateResumeResponse {
  id:        string;
  sessionId: string;
  pdfUrl?:   string;
}

export async function generateResume(
  payload: ResumeBuilderFormData,
): Promise<GenerateResumeResponse> {
  const res = await axiosInstance.post<GenerateResumeResponse>('/builder-v2/generate', payload);
  return res.data;
}

// ─── Download final resume as PDF ────────────────────────────────────────────

export async function downloadResume(
  sessionId: string,
  token: string,
  fullName: string,
  signal?: AbortSignal,
): Promise<void> {
  const res = await axiosInstance.post(
    '/builder-v2/download',
    { sessionId, token, name: fullName },
    { responseType: 'blob', signal },
  );
  const url  = URL.createObjectURL(res.data as Blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
