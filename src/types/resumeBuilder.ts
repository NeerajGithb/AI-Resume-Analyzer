// types/resumeBuilder.ts

// ─── Heading ──────────────────────────────────────────────────────────────────

export interface HeadingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  city: string;
  country: string;
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export interface SummaryFormData {
  targetRole: string;
  objective: string;
}

// ─── Education ────────────────────────────────────────────────────────────────

export interface EducationEntry {
  id: string;
  degree: string;
  degreeLevel?: string;
  program?: string;
  fieldOfStudy?: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export interface SkillsFormData {
  selected: string[];
}

// AI output only — not stored in form
export interface SkillCategory {
  label: string;
  values: string[];
}

// ─── Experience ───────────────────────────────────────────────────────────────

export interface ExperienceEntry {
  id: string;
  jobTitle: string;
  employer: string;
  employmentType: string;
  location: string;
  isRemote: boolean;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
  description: string;
  bullets: string[];
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectEntry {
  id: string;
  name: string;
  role: string;
  projectType: string;
  date: string;        // legacy / display fallback
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
  tech: string;        // comma-separated, used for resume rendering
  techList: string[];  // multi-select source (UI chips)
  resumeTech: string;  // AI-formatted tech string, only used in resume display
  linkLabel: string;
  linkHref: string;
  githubUrl: string;
  bullets: string[];
  description: string;
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export interface AchievementsFormData {
  items: string[];
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface ResumeBuilderFormData {
  heading: HeadingFormData;
  summary: SummaryFormData;
  education: EducationEntry[];
  skills: SkillsFormData;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  achievements: AchievementsFormData;
}

// ─── AI request / response types ──────────────────────────────────────────────

export interface SkillSuggestionRequest {
  targetRole: string;
}

export interface SkillSuggestionResponse {
  skills: string[];
}

export interface SkillCategorizationRequest {
  targetRole: string;
  selected: string[];
}

export interface SkillCategorizationResponse {
  categories: SkillCategory[];
}

export interface ProjectBulletsRequest {
  name: string;
  tech: string;
  description: string;
  targetRole: string;
  size?: 'full' | 'short';
}

export interface ProjectBulletsResponse {
  bullets: string[];
  name:    string;
  tech:    string[];
}

// ─── V2 Builder wrapper aliases ───────────────────────────────────────────────
// The v2 step-wrappers use these shorter names — kept as aliases so both
// the old and new naming conventions compile.

export type ExperienceItem = ExperienceEntry;

/** EducationItem — v2 wrapper shape (uses graduationMonth/Year + gpa instead of startYear/endYear). */
export interface EducationItem {
  id:              string;
  degree:          string;
  institution:     string;
  location:        string;
  graduationMonth: string;
  graduationYear:  string;
  gpa:             string;
}

/** Shape used by SkillsStepWrapper (v2 builder): three categorised skill lists. */
export interface SkillsData {
  technical: string[];
  soft:      string[];
  languages: string[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const defaultHeading: HeadingFormData = {
  firstName: '', lastName: '',
  phone: '', email: '',
  linkedin: '', github: '', portfolio: '',
  city: '', country: '',
};

export const defaultSummary: SummaryFormData = {
  targetRole: '',
  objective: '',
};

export const defaultEducationEntry = (): EducationEntry => ({
  id: crypto.randomUUID(),
  degree: '', institution: '',
  degreeLevel: '', program: '', fieldOfStudy: '',
  location: '',
  startYear: '', endYear: '',
});

export const defaultExperienceEntry = (): ExperienceEntry => ({
  id: crypto.randomUUID(),
  jobTitle: '', employer: '',
  employmentType: '',
  location: '', isRemote: false,
  startMonth: '', startYear: '',
  endMonth: '', endYear: '',
  isCurrent: false,
  description: '',
  bullets: [''],
});

export const defaultProjectEntry = (): ProjectEntry => ({
  id: crypto.randomUUID(),
  name: '', role: '', projectType: '',
  date: '',
  startMonth: '', startYear: '',
  endMonth: '', endYear: '',
  isCurrent: false,
  tech: '', techList: [], resumeTech: '',
  linkLabel: '', linkHref: '', githubUrl: '',
  bullets: [],
  description: '',
});

export const defaultFormData: ResumeBuilderFormData = {
  heading: defaultHeading,
  summary: defaultSummary,
  education: [],           // empty — step 3 not pre-passed
  skills: { selected: [] },
  experience: [],
  projects: [],
  achievements: { items: [] },
};