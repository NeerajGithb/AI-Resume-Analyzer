import { create } from 'zustand';
import { JobMatchStage } from '@/types';

interface JobMatchUIState {
  resume: File | null;
  jobDescription: string;
  stage: JobMatchStage | null;
  progress: number;

  setResume: (resume: File | null) => void;
  setJobDescription: (jobDescription: string) => void;
  setStageProgress: (stage: JobMatchStage | null, progress: number) => void;
  reset: () => void;
}

export const useJobMatchStore = create<JobMatchUIState>((set) => ({
  resume: null,
  jobDescription: '',
  stage: null,
  progress: 0,

  setResume: (resume) => set({ resume }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setStageProgress: (stage, progress) => set({ stage, progress }),
  reset: () => set({ resume: null, jobDescription: '', stage: null, progress: 0 }),
}));

