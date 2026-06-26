import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CoverLetterStage } from '@/types';

interface CoverLetterUIState {
  resume: File | null;
  jobDescription: string;
  companyName: string;
  tone: 'professional' | 'enthusiastic' | 'formal' | 'conversational';
  stage: CoverLetterStage | null;
  progress: number;

  setResume: (resume: File | null) => void;
  setJobDescription: (jobDescription: string) => void;
  setCompanyName: (companyName: string) => void;
  setTone: (tone: 'professional' | 'enthusiastic' | 'formal' | 'conversational') => void;
  setStageProgress: (stage: CoverLetterStage | null, progress: number) => void;
  reset: () => void;
}

export const useCoverLetterStore = create<CoverLetterUIState>()(
  persist(
    (set) => ({
      resume: null,
      jobDescription: '',
      companyName: '',
      tone: 'professional',
      stage: null,
      progress: 0,

      setResume: (resume) => set({ resume }),
      setJobDescription: (jobDescription) => set({ jobDescription }),
      setCompanyName: (companyName) => set({ companyName }),
      setTone: (tone) => set({ tone }),
      setStageProgress: (stage, progress) => set({ stage, progress }),
      reset: () => set({ resume: null, jobDescription: '', companyName: '', tone: 'professional', stage: null, progress: 0 }),
    }),
    {
      name: 'cover-letter-storage',
      // Only persist text fields, not File objects or progress state
      partialize: (state) => ({
        jobDescription: state.jobDescription,
        companyName: state.companyName,
        tone: state.tone,
      }),
    }
  )
);

