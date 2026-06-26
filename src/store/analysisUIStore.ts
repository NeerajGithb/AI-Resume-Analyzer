import { create } from 'zustand';
import { AnalysisStage } from '@/types';

interface AnalysisUIState {
  file: File | null;
  stage: AnalysisStage | null;
  progress: number;
  yearsOfExperience: string;
  targetRole: string;

  setFile: (file: File | null) => void;
  setStageProgress: (stage: AnalysisStage | null, progress: number) => void;
  setYearsOfExperience: (years: string) => void;
  setTargetRole: (role: string) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisUIState>((set) => ({
  file: null,
  stage: null,
  progress: 0,
  yearsOfExperience: '',
  targetRole: '',

  setFile: (file) => set({ file }),
  setStageProgress: (stage, progress) => set({ stage, progress }),
  setYearsOfExperience: (yearsOfExperience) => set({ yearsOfExperience }),
  setTargetRole: (targetRole) => set({ targetRole }),
  reset: () => set({ file: null, stage: null, progress: 0, yearsOfExperience: '', targetRole: '' }),
}));

