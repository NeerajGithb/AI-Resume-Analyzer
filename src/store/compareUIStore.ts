import { create } from 'zustand';
import { CompareStage } from '@/types';

interface CompareUIState {
  resume1: File | null;
  resume2: File | null;
  stage: CompareStage | null;
  progress: number;

  setResumes: (resume1: File | null, resume2: File | null) => void;
  setStageProgress: (stage: CompareStage | null, progress: number) => void;
  reset: () => void;
}

export const useCompareStore = create<CompareUIState>((set) => ({
  resume1: null,
  resume2: null,
  stage: null,
  progress: 0,

  setResumes: (resume1, resume2) => set({ resume1, resume2 }),
  setStageProgress: (stage, progress) => set({ stage, progress }),
  reset: () => set({ resume1: null, resume2: null, stage: null, progress: 0 }),
}));

