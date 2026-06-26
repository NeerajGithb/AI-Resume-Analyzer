import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ResumeBuilderFormData,
  HeadingData,
  PurposeData,
  ExperienceItem,
  EducationItem,
  SkillsData,
  SummaryData,
} from '@/types/resumeBuilder';

// ─── Optional section data types ──────────────────────────────────────────────

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
  description?: string;
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
  description?: string;
}

export interface InterestEntry {
  id: string;
  name: string;
}

export interface OptionalSectionsData {
  certifications:     CertificationEntry[];
  languages:          LanguageEntry[];
  awards:             AwardEntry[];
  websites:           WebsiteEntry[];
  volunteerExp:       VolunteerEntry[];
  interests:          InterestEntry[];
  customSectionItems: { sectionName: string; content: string }[];
}

// ─── Generation progress ──────────────────────────────────────────────────────

export type BuilderStage = 'uploading' | 'analyzing' | 'organizing' | 'generating';

const emptyOptional: OptionalSectionsData = {
  certifications:     [],
  languages:          [],
  awards:             [],
  websites:           [],
  volunteerExp:       [],
  interests:          [],
  customSectionItems: [],
};

// ─── Store interface ──────────────────────────────────────────────────────────

interface ResumeBuilderV2State {
  formData:           ResumeBuilderFormData;
  currentStep:        number;
  experienceLevel:    string | null;
  isStudent:          boolean | null;
  experienceSkipped:  boolean;
  sessionId:          string;
  selectedSections:   string[];
  customSections:     string[];
  optionalSections:   OptionalSectionsData;

  /** Generation progress — null when idle */
  stage:    BuilderStage | null;
  progress: number | null;

  setFormData:             (data: Partial<ResumeBuilderFormData>) => void;
  updateHeading:           (data: Partial<HeadingData>) => void;
  updatePurpose:           (data: Partial<PurposeData>) => void;
  setExperience:           (experience: ExperienceItem[]) => void;
  addExperience:           (item: ExperienceItem) => void;
  updateExperience:        (id: string, item: Partial<ExperienceItem>) => void;
  removeExperience:        (id: string) => void;
  setEducation:            (education: EducationItem[]) => void;
  addEducation:            (item: EducationItem) => void;
  updateEducation:         (id: string, item: Partial<EducationItem>) => void;
  removeEducation:         (id: string) => void;
  updateSkills:            (skills: Partial<SkillsData>) => void;
  updateSummary:           (summary: Partial<SummaryData>) => void;
  toggleSection:           (id: string) => void;
  addCustomSection:        (name: string) => void;
  setExperienceSkipped:    (skipped: boolean) => void;
  updateOptionalSections:  (data: Partial<OptionalSectionsData>) => void;
  newSession:              () => void;

  setCurrentStep: (step: number) => void;
  nextStep:       () => void;
  prevStep:       () => void;

  setExperienceLevel: (level: string) => void;
  setIsStudent:       (isStudent: boolean) => void;

  /** Set generation stage + progress together */
  setGenerationProgress: (stage: BuilderStage | null, progress: number | null) => void;
  /** Convenience: clear progress back to idle */
  clearGenerationProgress: () => void;

  isStepComplete:        (step: number) => boolean;
  getCompletionPercentage: () => number;

  reset: () => void;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialFormData: ResumeBuilderFormData = {
  heading: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    pinCode: '',
    linkedin: '',
    website: '',
  },
  purpose: {
    reason: 'job-seeking',
    targetRole: '',
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
  },
  summary: {
    objective: '',
    highlights: [],
  },
};

// ─── Session token helpers ────────────────────────────────────────────────────

const genSessionToken = (): string => {
  const header  = { typ: 'JWT', alg: 'ES256', kid: _randB64(12) };
  const payload = {
    sub:   _randUUID(),
    iat:   Math.floor(Date.now() / 1000),
    iss:   'resume-builder',
    sid:   _randB64(16),
    nonce: _randB64(24),
    jti:   _randB64(20),
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

// ─── Store ────────────────────────────────────────────────────────────────────

export const useResumeBuilderV2Store = create<ResumeBuilderV2State>()(
  persist(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────────────────────
      formData:          initialFormData,
      currentStep:       1,
      experienceLevel:   null,
      isStudent:         null,
      experienceSkipped: false,
      sessionId:         genSessionToken(),
      selectedSections:  ['personal-details', 'certifications'],
      customSections:    [],
      optionalSections:  emptyOptional,

      // Generation progress — NOT persisted (always idle on page load)
      stage:    null,
      progress: null,

      // ── Form actions ─────────────────────────────────────────────────────
      setFormData: (data) =>
        set((s) => ({ formData: { ...s.formData, ...data } })),

      updateHeading: (data) =>
        set((s) => ({ formData: { ...s.formData, heading: { ...s.formData.heading, ...data } } })),

      updatePurpose: (data) =>
        set((s) => ({ formData: { ...s.formData, purpose: { ...s.formData.purpose, ...data } } })),

      setExperience: (experience) =>
        set((s) => ({ formData: { ...s.formData, experience } })),

      addExperience: (item) =>
        set((s) => ({ formData: { ...s.formData, experience: [...s.formData.experience, item] } })),

      updateExperience: (id, item) =>
        set((s) => ({
          formData: {
            ...s.formData,
            experience: s.formData.experience.map((e) => e.id === id ? { ...e, ...item } : e),
          },
        })),

      removeExperience: (id) =>
        set((s) => ({
          formData: { ...s.formData, experience: s.formData.experience.filter((e) => e.id !== id) },
        })),

      setEducation: (education) =>
        set((s) => ({ formData: { ...s.formData, education } })),

      addEducation: (item) =>
        set((s) => ({ formData: { ...s.formData, education: [...s.formData.education, item] } })),

      updateEducation: (id, item) =>
        set((s) => ({
          formData: {
            ...s.formData,
            education: s.formData.education.map((e) => e.id === id ? { ...e, ...item } : e),
          },
        })),

      removeEducation: (id) =>
        set((s) => ({
          formData: { ...s.formData, education: s.formData.education.filter((e) => e.id !== id) },
        })),

      updateSkills: (skills) =>
        set((s) => ({ formData: { ...s.formData, skills: { ...s.formData.skills, ...skills } } })),

      updateSummary: (summary) =>
        set((s) => ({ formData: { ...s.formData, summary: { ...s.formData.summary, ...summary } } })),

      toggleSection: (id) =>
        set((s) => ({
          selectedSections: s.selectedSections.includes(id)
            ? s.selectedSections.filter((x) => x !== id)
            : [...s.selectedSections, id],
        })),

      addCustomSection: (name) =>
        set((s) => ({
          customSections:   s.customSections.includes(name) ? s.customSections : [...s.customSections, name],
          selectedSections: [...s.selectedSections, name],
        })),

      setExperienceSkipped: (skipped) => set({ experienceSkipped: skipped }),

      updateOptionalSections: (data) =>
        set((s) => ({ optionalSections: { ...s.optionalSections, ...data } })),

      // ── Generation progress ──────────────────────────────────────────────
      setGenerationProgress: (stage, progress) => set({ stage, progress }),
      clearGenerationProgress: () => set({ stage: null, progress: null }),

      // ── Session ──────────────────────────────────────────────────────────
      newSession: () =>
        set({
          formData:          initialFormData,
          currentStep:       1,
          experienceLevel:   null,
          isStudent:         null,
          experienceSkipped: false,
          sessionId:         genSessionToken(),
          selectedSections:  ['personal-details', 'certifications'],
          customSections:    [],
          optionalSections:  emptyOptional,
          stage:             null,
          progress:          null,
        }),

      // ── Navigation ───────────────────────────────────────────────────────
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 6) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      // ── Meta ─────────────────────────────────────────────────────────────
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      setIsStudent:       (isStudent) => set({ isStudent }),

      // ── Validation ───────────────────────────────────────────────────────
      isStepComplete: (step) => {
        const { formData } = get();
        switch (step) {
          case 1:
            return !!(formData.heading.firstName && formData.heading.lastName && formData.heading.email && formData.heading.phone);
          case 2:
            return formData.experience.length > 0 || get().experienceSkipped;
          case 3:
            return formData.education.length > 0;
          case 4:
            return formData.skills.technical.length > 0 || formData.skills.soft.length > 0 || formData.skills.languages.length > 0;
          case 5:
            return formData.summary.objective.length > 0;
          case 6:
            return true;
          default:
            return false;
        }
      },

      getCompletionPercentage: () => {
        const completed = [1, 2, 3, 4, 5].filter((s) => get().isStepComplete(s)).length;
        return Math.round((completed / 5) * 100);
      },

      // ── Reset ────────────────────────────────────────────────────────────
      reset: () =>
        set({
          formData:          initialFormData,
          currentStep:       1,
          experienceLevel:   null,
          isStudent:         null,
          experienceSkipped: false,
          sessionId:         genSessionToken(),
          selectedSections:  ['personal-details', 'certifications'],
          customSections:    [],
          optionalSections:  emptyOptional,
          stage:             null,
          progress:          null,
        }),
    }),
    {
      name: 'resume-builder-v2-storage',
      // stage/progress intentionally excluded — always idle on page load
      partialize: (s) => ({
        formData:          s.formData,
        currentStep:       s.currentStep,
        experienceLevel:   s.experienceLevel,
        isStudent:         s.isStudent,
        experienceSkipped: s.experienceSkipped,
        sessionId:         s.sessionId,
        selectedSections:  s.selectedSections,
        customSections:    s.customSections,
        optionalSections:  s.optionalSections,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.sessionId.includes('.')) {
          state.sessionId = genSessionToken();
        }
      },
    }
  )
);