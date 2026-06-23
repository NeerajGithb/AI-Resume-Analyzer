import { create } from 'zustand';
import { AnalysisStage } from '@/types';

interface AnalysisUIState {
  file: File | null;
  stage: AnalysisStage | null;
  progress: number;

  setFile: (file: File | null) => void;
  setStageProgress: (stage: AnalysisStage | null, progress: number) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisUIState>((set) => ({
  file: null,
  stage: null,
  progress: 0,

  setFile: (file) => set({ file }),
  setStageProgress: (stage, progress) => set({ stage, progress }),
  reset: () => set({ file: null, stage: null, progress: 0 }),
}));

