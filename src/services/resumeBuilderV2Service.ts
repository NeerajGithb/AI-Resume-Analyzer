import axiosInstance, { ApiError } from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import type { ResumeBuilderFormData } from '@/types/resumeBuilder';

const STAGES = ['uploading', 'analyzing', 'organizing', 'generating'];
const STAGE_DURATIONS_MS = [900, 1400, 1800, 600];

// ─── V2 API payload shape (matches BuilderV2InputSchema on backend) ────────────
interface BuilderV2ApiInput {
  name: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  location?: string;
  targetRole: string;
  experience: Array<{
    jobTitle: string;
    employer: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  technicalSkills: string;
  softSkills: string;
  languages: string;
  summary?: {
    objective: string;
    highlights: string[];
  };
}

// ─── V2 result shape (matches BuilderV2Result on backend) ─────────────────────
export interface BuilderV2Result {
  id: string;
  name: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  location?: string;
  targetRole: string;
  experience: Array<{
    jobTitle: string;
    employer: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  technicalSkills: string;
  softSkills: string;
  languages: string;
  summary: string;
  projects: Array<{
    name: string;
    technologies: string;
    year: string;
    url?: string;
    bullets: string[];
  }>;
  achievements: string[];
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ─── Transform frontend form → V2 API payload ─────────────────────────────────
function transformToV2Payload(formData: ResumeBuilderFormData): BuilderV2ApiInput {
  const experience = formData.experience.map((exp) => ({
    jobTitle: exp.jobTitle,
    employer: exp.employer || '',
    location: exp.isRemote ? 'Remote' : (exp.location || ''),
    startDate: [exp.startMonth, exp.startYear].filter(Boolean).join(' '),
    endDate: exp.isCurrent ? 'Present' : [exp.endMonth, exp.endYear].filter(Boolean).join(' '),
    description: exp.description || '',
  }));

  const education = formData.education.map((edu) => ({
    degree: edu.degree || '',
    institution: edu.institution,
    location: edu.location || '',
    graduationDate: [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' '),
    gpa: edu.gpa || undefined,
  }));

  // targetRole: prefer summary step value, fall back to purpose, then first job title
  const targetRole =
    formData.summary.targetRole?.trim() ||
    formData.purpose.targetRole?.trim() ||
    formData.experience[0]?.jobTitle ||
    'Professional';

  const location = [formData.heading.city, formData.heading.country]
    .filter(Boolean)
    .join(', ');

  return {
    name: `${formData.heading.firstName} ${formData.heading.lastName}`.trim(),
    phone: formData.heading.phone,
    email: formData.heading.email,
    linkedin: formData.heading.linkedin || undefined,
    github: formData.heading.website || undefined,
    location: location || undefined,
    targetRole,
    experience,
    education,
    technicalSkills: formData.skills.technical.join(', '),
    softSkills: formData.skills.soft.join(', '),
    languages: formData.skills.languages.join(', '),
    summary: formData.summary.objective
      ? { objective: formData.summary.objective, highlights: formData.summary.highlights }
      : undefined,
  };
}

// ─── Generate resume via V2 endpoint ──────────────────────────────────────────
export async function generateResumeV2(
  formData: ResumeBuilderFormData,
  signal: AbortSignal,
  onStage: (stage: string, progress: number) => void,
): Promise<BuilderV2Result> {
  const progress = new ProgressHelper(onStage, signal);

  return await progress.run(
    STAGES,
    async () => {
      try {
        const payload = transformToV2Payload(formData);

        const response = await axiosInstance.post<ApiResponse<BuilderV2Result>>(
          '/builder-v2',
          payload,
          { signal },
        );

        if (!response.data?.success || !response.data?.data) {
          throw new ApiError(500, 'Invalid response from server');
        }

        return response.data.data;
      } catch (error) {
        if (error instanceof ApiError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw error;
        throw new ApiError(500, 'Resume generation failed. Please try again.');
      }
    },
    STAGE_DURATIONS_MS,
  );
}

// ─── Fetch saved resume by ID ─────────────────────────────────────────────────
export async function getResumeByIdV2(id: string): Promise<BuilderV2Result> {
  try {
    const response = await axiosInstance.get<ApiResponse<BuilderV2Result>>(`/builder-v2/${id}`);

    if (!response.data?.success || !response.data?.data) {
      throw new ApiError(500, 'Invalid response from server');
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to load resume. Please try again.');
  }
}
