'use client';

import { useAuthStore } from '@/store/authStore';
import { TMember } from '@/types/member';
import { api } from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function useAuth() {
  const { token, setToken, reset } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   checkAuth()
  // }, [])

  const checkUser = async (comp: string, memberId: string) => {
    try {
      const response = await await api.get(
        `/eoffice/Eoffice_Get_Member_V2/COMP/${comp}/MEMBER/${memberId}/HR044/0`,
        {
          baseURL: '/api',
        },
      );
      return response;
    } catch (error) {
      toast.error('Vui lòng kiểm tra lại MSTV');
      console.error('Member info is not found:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      if (token) {
        const response = await api.post(
          '/auth/initialize',
          { token },
          { baseURL: '/api' },
        );
        if (!response.error) {
          router.push('/');
          return { success: true };
        } else {
          await logout();
        }
      }
      return null;
    } catch (e) {
      console.error('login', e);
    }
  };

  const login = async (member: TMember, password: string) => {
    try {
      const response = await api.post(
        '/auth/login',
        { member, password },
        { baseURL: '/api' },
      );

      if (!response.error) {
        setToken(response.token);
        router.push('/');
        return { success: true };
      } else {
        toast.error(response.error);
      }
    } catch (e) {
      console.error('login', e);
    }
  };

  const logout = async () => {
    await api.post('/auth/logout', {}, { baseURL: '/api' });
    reset();
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout, checkAuth, checkUser };
}
