import { TMember } from '@/types/member';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TAuthState = {
  member: TMember | null;
  setMember: (data: TMember) => void;
  setToken: (data: string) => void;
  token: string | null;
  reset: () => void;
};

export const useAuthStore = create<TAuthState>()(
  persist(
    (set) => ({
      member: null,
      token: null,
      setToken: (data) => set({ token: data }),
      setMember: (data) => set({ member: data }),
      reset: () => set({ member: null }),
    }),
    { name: 'auth-storage' }, // localStorage key
  ),
);
