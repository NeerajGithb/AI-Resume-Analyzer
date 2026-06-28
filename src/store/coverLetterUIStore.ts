'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CoverLetterStage } from '@/types';

export type CoverLetterTone = 'professional' | 'formal' | 'friendly';

interface CoverLetterUIState {
  // Form inputs
  resume: File | null;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  hiringManagerName: string;
  tone: CoverLetterTone;

  // Generation progress
  stage: CoverLetterStage | null;
  progress: number;

  // Setters
  setResume: (resume: File | null) => void;
  setJobTitle: (v: string) => void;
  setCompanyName: (v: string) => void;
  setJobDescription: (v: string) => void;
  setHiringManagerName: (v: string) => void;
  setTone: (v: CoverLetterTone) => void;
  setStageProgress: (stage: CoverLetterStage | null, progress: number) => void;
  reset: () => void;
}

const DEFAULTS = {
  resume: null,
  jobTitle: '',
  companyName: '',
  jobDescription: '',
  hiringManagerName: '',
  tone: 'professional' as CoverLetterTone, // matches backend Zod enum: professional | formal | friendly
  stage: null,
  progress: 0,
};

export const useCoverLetterStore = create<CoverLetterUIState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setResume: (resume) => set({ resume }),
      setJobTitle: (jobTitle) => set({ jobTitle }),
      setCompanyName: (companyName) => set({ companyName }),
      setJobDescription: (jobDescription) => set({ jobDescription }),
      setHiringManagerName: (hiringManagerName) => set({ hiringManagerName }),
      setTone: (tone) => set({ tone }),
      setStageProgress: (stage, progress) => set({ stage, progress }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'cover-letter-storage',
      partialize: (s) => ({
        jobTitle: s.jobTitle,
        companyName: s.companyName,
        jobDescription: s.jobDescription,
        hiringManagerName: s.hiringManagerName,
        tone: s.tone,
      }),
    }
  )
);