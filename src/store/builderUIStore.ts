import { create } from 'zustand';

interface BuilderUIState {
  isLoading: boolean;

  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderUIState>((set) => ({
  isLoading: false,

  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ isLoading: false }),
}));

