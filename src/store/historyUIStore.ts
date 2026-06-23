import { create } from 'zustand';
import { HistoryItem } from '@/types';

interface HistoryUIState {
  selectedItem: HistoryItem | null;
  setSelectedItem: (item: HistoryItem | null) => void;
}

export const useHistoryStore = create<HistoryUIState>((set) => ({
  selectedItem: null,
  setSelectedItem: (selectedItem) => set({ selectedItem }),
}));

