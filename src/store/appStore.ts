import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TAppState = {
  isLoading: boolean;
  spToken: string | null;
  setIsLoading: (data: boolean) => void;
  setSPToken: (data: string) => void;
};

export const useAppStore = create<TAppState>()((set) => ({
  // Initial State
  isLoading: false,
  spToken: null,

  // Actions
  setIsLoading: (data) => set({ isLoading: data }),
  setSPToken: (data) => set({ spToken: data }),
}));
