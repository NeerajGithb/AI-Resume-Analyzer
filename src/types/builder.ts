// ─── Resume Builder Types ─────────────────────────────────────────────────────

export interface BuilderInput {
  name: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  degree: string;
  institution: string;
  location?: string;
  graduationYear?: string;
  targetRole: string;
  projectsExperience?: string;
  skills: string;
}

export interface BuilderResult {
  id: string;
  name: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  degree: string;
  institution: string;
  location?: string;
  graduationYear?: string;
  skills: string;
  targetRole: string;
  summary: string;
  projects: Array<{
    name: string;
    year: string;
    technologies: string;
    url?: string;
    bullets: string[];
  }>;
  achievements: string[];
  createdAt: Date;
}
