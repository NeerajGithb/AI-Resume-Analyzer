'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LinkedInStage, LinkedInResult } from '@/types';

export type LinkedInPath = 'resume' | 'analyze' | 'build' | null;
export type LinkedInSection = 'headline' | 'about' | 'experience' | 'skills';

interface LinkedInUIState {
  // Wizard state
  hasResume: boolean | null;
  hasLinkedIn: boolean | null;
  path: LinkedInPath;

  // Path 1 — resume upload
  resumeFile: File | null;

  // Path 2 — analyze existing sections
  selectedSections: LinkedInSection[];
  sectionInputs: Record<LinkedInSection, string>;

  // Path 3 — build from scratch
  fullName: string;
  targetRole: string;
  yearsOfExperience: string;
  skills: string;
  experience: string;
  education: string;
  projects: string;
  certifications: string;

  // Progress
  stage: LinkedInStage | null;
  progress: number;

  // Result — persisted so refresh keeps the result view
  result: LinkedInResult | null;

  // Setters
  setHasResume: (v: boolean | null) => void;
  setHasLinkedIn: (v: boolean | null) => void;
  setPath: (v: LinkedInPath) => void;
  setResumeFile: (v: File | null) => void;
  toggleSection: (s: LinkedInSection) => void;
  setSectionInput: (s: LinkedInSection, v: string) => void;
  setField: (field: keyof LinkedInUIState, value: string) => void;
  setStageProgress: (stage: LinkedInStage | null, progress: number) => void;
  setResult: (v: LinkedInResult | null) => void;
  reset: () => void;
}

const DEFAULTS: Omit<LinkedInUIState, keyof Pick<LinkedInUIState,
  'setHasResume'|'setHasLinkedIn'|'setPath'|'setResumeFile'|'toggleSection'|'setSectionInput'|'setField'|'setStageProgress'|'setResult'|'reset'
>> = {
  hasResume: null, hasLinkedIn: null, path: null,
  resumeFile: null,
  selectedSections: [],
  sectionInputs: { headline: '', about: '', experience: '', skills: '' },
  fullName: '',
  targetRole: '',
  yearsOfExperience: '', skills: '', experience: '',
  education: '', projects: '', certifications: '',
  stage: null, progress: 0,
  result: null,
};

export const useLinkedInStore = create<LinkedInUIState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,
      setHasResume:  (v) => set({ hasResume: v }),
      setHasLinkedIn:(v) => set({ hasLinkedIn: v }),
      setPath:       (v) => set({ path: v }),
      setResumeFile: (v) => set({ resumeFile: v }),
      toggleSection: (s) => {
        const cur = get().selectedSections;
        set({ selectedSections: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] });
      },
      setSectionInput: (s, v) => set(state => ({
        sectionInputs: { ...state.sectionInputs, [s]: v },
      })),
      setField: (field, value) => set({ [field]: value } as any),
      setStageProgress: (stage, progress) => set({ stage, progress }),
      setResult: (v) => set({ result: v }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'linkedin-storage-v2',
      // Persist form content + result — NOT wizard nav state (hasResume/hasLinkedIn/path)
      partialize: (s) => ({
        selectedSections: s.selectedSections, sectionInputs: s.sectionInputs,
        fullName: s.fullName, targetRole: s.targetRole,
        yearsOfExperience: s.yearsOfExperience, skills: s.skills,
        experience: s.experience, education: s.education,
        projects: s.projects, certifications: s.certifications,
        result: s.result,
      }),
    },
  ),
);
