import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TAppState = {
  isLoading: boolean;
  isInitMSAL: boolean;
  spToken: string | null;
  setIsLoading: (data: boolean) => void;
  setSPToken: (data: string) => void;
  setIsInitMSAL: (data: boolean) => void;
};

export const useAppStore = create<TAppState>()((set) => ({
  // Initial State
  isInitMSAL: false,
  isLoading: false,
  spToken: null,

  // Actions
  setIsInitMSAL: (data) => set({ isLoading: data }),
  setIsLoading: (data) => set({ isLoading: data }),
  setSPToken: (data) => set({ spToken: data }),
}));
