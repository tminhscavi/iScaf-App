import { TMember } from '@/types/member';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TAuthState = {
  member: TMember | null;
  companyCode: string | null;
  token: string | null;
  isAuthenticated: boolean;
  setMember: (data: TMember) => void;
  setToken: (data: string) => void;
  setCompanyCode: (data: string) => void;
  reset: () => void;
};

export const useAuthStore = create<TAuthState>()(
  persist(
    (set) => ({
      member: null,
      companyCode: null,
      token: null,
      spToken: null,
      isAuthenticated: false,
      setToken: (data) => set({ token: data, isAuthenticated: true }),
      setMember: (data) => set({ member: data }),
      setCompanyCode: (data) => set({ companyCode: data }),
      reset: () => set({ member: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' },
  ),
);
