// store/resumeBuilderV2Store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ResumeBuilderFormData,
  HeadingFormData,
  SummaryFormData,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  SkillsFormData,
  AchievementsFormData,
} from '@/types/resumeBuilder';
import {
  defaultFormData,
  defaultEducationEntry,
  defaultExperienceEntry,
  defaultProjectEntry,
} from '@/types/resumeBuilder';

// ─── Optional section types ───────────────────────────────────────────────────

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: 'Basic' | 'Conversational' | 'Proficient' | 'Fluent' | 'Native';
}

export interface AwardEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface WebsiteEntry {
  id: string;
  label: string;
  url: string;
}

export interface VolunteerEntry {
  id: string;
  role: string;
  organisation: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface InterestEntry {
  id: string;
  name: string;
}

export interface OptionalSections {
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  awards: AwardEntry[];
  websites: WebsiteEntry[];
  volunteerExp: VolunteerEntry[];
  interests: InterestEntry[];
}

const defaultOptionalSections = (): OptionalSections => ({
  certifications: [],
  languages: [],
  awards: [],
  websites: [],
  volunteerExp: [],
  interests: [],
});

// ─── Session token ────────────────────────────────────────────────────────────

const genSessionToken = (): string => {
  const header = { typ: 'JWT', alg: 'ES256', kid: _randB64(12) };
  const payload = {
    sub: _randUUID(),
    iat: Math.floor(Date.now() / 1000),
    iss: 'resume-builder',
    sid: _randB64(16),
    nonce: _randB64(24),
    jti: _randB64(20),
  };
  const sig = _randB64(86);
  return [_toB64url(JSON.stringify(header)), _toB64url(JSON.stringify(payload)), sig].join('.');
};

function _toB64url(str: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let b64 = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i], b1 = bytes[i + 1] ?? 0, b2 = bytes[i + 2] ?? 0;
    b64 += TABLE[b0 >> 2];
    b64 += TABLE[((b0 & 3) << 4) | (b1 >> 4)];
    b64 += bytes[i + 1] !== undefined ? TABLE[((b1 & 15) << 2) | (b2 >> 6)] : '=';
    b64 += bytes[i + 2] !== undefined ? TABLE[b2 & 63] : '=';
  }
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function _randB64(len: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * 64)]).join('');
}

function _randUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface ResumeBuilderV2State {
  formData: ResumeBuilderFormData;
  optionalSections: OptionalSections;
  currentStep: number;
  sessionId: string;
  experienceLevel: string | null;
  isStudent: boolean | null;
  setExperienceLevel: (level: string) => void;
  setIsStudent: (val: boolean) => void;
  // ── Heading ──────────────────────────────────────────────────────────────
  updateHeading: (data: Partial<HeadingFormData>) => void;

  // ── Summary ──────────────────────────────────────────────────────────────
  updateSummary: (data: Partial<SummaryFormData>) => void;

  // ── Education ────────────────────────────────────────────────────────────
  setEducation:    (data: EducationEntry[]) => void;
  addEducation:    () => void;
  updateEducation: (id: string, data: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;

  // ── Experience ───────────────────────────────────────────────────────────
  setExperience:    (data: ExperienceEntry[]) => void;
  addExperience:    () => void;
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  experienceSkipped:    boolean;
  setExperienceSkipped: (val: boolean) => void;

  // ── Skills ───────────────────────────────────────────────────────────────
  updateSkills: (data: Partial<SkillsFormData>) => void;

  // ── Projects ─────────────────────────────────────────────────────────────
  addProject: () => void;
  updateProject: (id: string, data: Partial<ProjectEntry>) => void;
  removeProject: (id: string) => void;

  // ── Achievements ─────────────────────────────────────────────────────────
  updateAchievements: (data: Partial<AchievementsFormData>) => void;

  // ── Optional sections ────────────────────────────────────────────────────
  updateOptionalSections: (data: Partial<OptionalSections>) => void;

  // ── Navigation ───────────────────────────────────────────────────────────
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // ── Skipped steps ─────────────────────────────────────────────────────────
  skippedSteps: Set<number>;
  skipStep: (step: number) => void;
  unskipStep: (step: number) => void;

  // ── Validation ───────────────────────────────────────────────────────────
  isStepComplete: (step: number) => boolean;
  getCompletionPercentage: () => number;
  // Add to interface
  hasStepData: (step: number) => boolean;
  // ── Session ──────────────────────────────────────────────────────────────
  newSession: () => string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useResumeBuilderV2Store = create<ResumeBuilderV2State>()(
  persist(
    (set, get) => ({
      formData: defaultFormData,
      optionalSections: defaultOptionalSections(),
      currentStep: 1,
      sessionId: genSessionToken(),
      skippedSteps: new Set<number>(),
      experienceLevel: null,
      isStudent: null,
      experienceSkipped: false,

      // add actions:
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      setIsStudent: (val) => set({ isStudent: val }),
      // ── Heading ────────────────────────────────────────────────────────────
      updateHeading: (data) =>
        set((s) => ({
          formData: { ...s.formData, heading: { ...s.formData.heading, ...data } },
        })),

      // ── Summary ────────────────────────────────────────────────────────────
      updateSummary: (data) =>
        set((s) => ({
          formData: { ...s.formData, summary: { ...s.formData.summary, ...data } },
        })),

      // ── Education ──────────────────────────────────────────────────────────
      setEducation: (data) =>
        set((s) => ({ formData: { ...s.formData, education: data } })),

      addEducation: () =>
        set((s) => ({
          formData: { ...s.formData, education: [...s.formData.education, defaultEducationEntry()] },
        })),

      updateEducation: (id, data) =>
        set((s) => ({
          formData: {
            ...s.formData,
            education: s.formData.education.map((e) => e.id === id ? { ...e, ...data } : e),
          },
        })),

      removeEducation: (id) =>
        set((s) => ({
          formData: {
            ...s.formData,
            education: s.formData.education.filter((e) => e.id !== id),
          },
        })),

      // ── Experience ─────────────────────────────────────────────────────────
      setExperience: (data) =>
        set((s) => ({ formData: { ...s.formData, experience: data } })),

      addExperience: () =>
        set((s) => ({
          formData: { ...s.formData, experience: [...s.formData.experience, defaultExperienceEntry()] },
        })),

      updateExperience: (id, data) =>
        set((s) => ({
          formData: {
            ...s.formData,
            experience: s.formData.experience.map((e) => e.id === id ? { ...e, ...data } : e),
          },
        })),

      removeExperience: (id) =>
        set((s) => ({
          formData: {
            ...s.formData,
            experience: s.formData.experience.filter((e) => e.id !== id),
          },
        })),

      setExperienceSkipped: (val) => set({ experienceSkipped: val }),

      // ── Skills ─────────────────────────────────────────────────────────────
      updateSkills: (data) =>
        set((s) => ({
          formData: { ...s.formData, skills: { ...s.formData.skills, ...data } },
        })),

      // ── Projects ───────────────────────────────────────────────────────────
      addProject: () =>
        set((s) => ({
          formData: { ...s.formData, projects: [...s.formData.projects, defaultProjectEntry()] },
        })),

      updateProject: (id, data) =>
        set((s) => ({
          formData: {
            ...s.formData,
            projects: s.formData.projects.map((p) => p.id === id ? { ...p, ...data } : p),
          },
        })),

      removeProject: (id) =>
        set((s) => ({
          formData: {
            ...s.formData,
            projects: s.formData.projects.filter((p) => p.id !== id),
          },
        })),

      // ── Achievements ───────────────────────────────────────────────────────
      updateAchievements: (data) =>
        set((s) => ({
          formData: { ...s.formData, achievements: { ...s.formData.achievements, ...data } },
        })),

      // ── Optional sections ──────────────────────────────────────────────────
      updateOptionalSections: (data) =>
        set((s) => ({
          optionalSections: { ...s.optionalSections, ...data },
        })),

      // ── Navigation ─────────────────────────────────────────────────────────
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 7) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      // ── Skipped steps ───────────────────────────────────────────────────────
      skipStep: (step) =>
        set((s) => ({ skippedSteps: new Set(s.skippedSteps).add(step) })),
      unskipStep: (step) =>
        set((s) => {
          const next = new Set(s.skippedSteps);
          next.delete(step);
          return { skippedSteps: next };
        }),

      // ── Validation ─────────────────────────────────────────────────────────
      isStepComplete: (step) => {
        const { formData } = get();
        switch (step) {
          case 1: // Heading
            return !!(
              formData.heading.firstName &&
              formData.heading.lastName &&
              formData.heading.email &&
              formData.heading.phone
            );
          case 2: // Education
            return (
              formData.education.length > 0 &&
              formData.education.every((e) => e.institution && (e.program || e.degreeLevel || e.degree))
            );
          case 3: // Experience (skippable)
            if (get().skippedSteps.has(3)) return true;
            return (
              formData.experience.length > 0 &&
              formData.experience.every((e) => e.jobTitle && e.employer)
            );
          case 4: // Skills
            return formData.skills.selected.length > 0;
          case 5: // Projects (skippable)
            if (get().skippedSteps.has(5)) return true;
            return (
              formData.projects.length > 0 &&
              formData.projects.every((p) => p.name && p.tech && p.bullets.length > 0)
            );
          case 6: // Summary
            return !!(formData.summary.targetRole && formData.summary.objective);
          case 7: // Finalize
            return true;
          default:
            return false;
        }
      },

      getCompletionPercentage: () => {
        const completed = [1, 2, 3, 4, 5, 6].filter((s) => get().isStepComplete(s)).length;
        return Math.round((completed / 6) * 100);
      },
      // In store implementation
      hasStepData: (step) => {
        const { formData } = get();
        switch (step) {
          case 1: return !!(formData.heading.firstName && formData.heading.lastName && formData.heading.email && formData.heading.phone);
          case 2: return formData.education.length > 0 && formData.education.every((e) => e.institution && (e.program || e.degreeLevel || e.degree));
          case 3: return formData.experience.length > 0 && formData.experience.every((e) => e.jobTitle && e.employer);
          case 4: return formData.skills.selected.length > 0;
          case 5: return formData.projects.length > 0 && formData.projects.every((p) => p.name && p.tech && p.bullets.length > 0);
          case 6: return !!(formData.summary.targetRole && formData.summary.objective);
          default: return false;
        }
      },
      // ── Session ────────────────────────────────────────────────────────────
      newSession: () => {
        const newId = genSessionToken();
        set({
          formData: defaultFormData,
          optionalSections: defaultOptionalSections(),
          currentStep: 1,
          sessionId: newId,
          experienceLevel: null,
          isStudent: null,
          experienceSkipped: false,
          skippedSteps: new Set<number>(),
        });
        return newId;
      },
    }),
    {
      name: 'resume-builder-v2-storage',
      // ── partialize — serialize Set as array
      partialize: (s) => ({
        experienceLevel:   s.experienceLevel,
        isStudent:         s.isStudent,
        experienceSkipped: s.experienceSkipped,
        formData:          s.formData,
        optionalSections:  s.optionalSections,
        currentStep:       s.currentStep,
        sessionId:         s.sessionId,
        skippedSteps:      Array.from(s.skippedSteps),   // ← add
      }),
      // ── onRehydrateStorage — convert array back to Set
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.sessionId.includes('.')) {
          state.sessionId = genSessionToken();
        }
        // JSON deserializes Set as array — convert back
        if (Array.isArray((state as any).skippedSteps)) {
          state.skippedSteps = new Set((state as any).skippedSteps);
        } else {
          state.skippedSteps = new Set();
        }
      },
    }
  )
);