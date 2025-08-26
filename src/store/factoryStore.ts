import { TFactory } from '@/types/factory';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TFactoryState = {
  factory: TFactory | null;
  setFactory: (data: TFactory) => void;
};

export const useFactoryStore = create<TFactoryState>()(
  persist(
    (set) => ({
      factory: null,

      setFactory: (data) => set({ factory: data }),
    }),
    { name: 'factory-storage' }, // localStorage key
  ),
);
