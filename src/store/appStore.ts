import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TAppState = {
  isLoading: boolean;
  setIsLoading: (data: boolean) => void;
};

export const useAppStore = create<TAppState>()(
  persist(
    (set) => ({
      isLoading: false,

      setIsLoading: (data) => set({ isLoading: data }),
    }),
    { name: 'app-storage' }, // localStorage key
  ),
);
