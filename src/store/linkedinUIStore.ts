import { create } from 'zustand';
import { LinkedInStage } from '@/types';

interface LinkedInUIState {
  profileText: string;
  stage: LinkedInStage | null;
  progress: number;

  setProfileText: (profileText: string) => void;
  setStageProgress: (stage: LinkedInStage | null, progress: number) => void;
  reset: () => void;
}

export const useLinkedInStore = create<LinkedInUIState>((set) => ({
  profileText: '',
  stage: null,
  progress: 0,

  setProfileText: (profileText) => set({ profileText }),
  setStageProgress: (stage, progress) => set({ stage, progress }),
  reset: () => set({ profileText: '', stage: null, progress: 0 }),
}));

