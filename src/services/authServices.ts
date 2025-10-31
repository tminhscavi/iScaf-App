import { TMember } from '@/types/member';
import { api } from '@/utils/axios';

async function getMemberInfo(comp: string, memberId: string) {
  const res = api.get(
    `/eoffice/Eoffice_Get_Member_V2/COMP/${comp}/MEMBER/${memberId}/HR044/0`,
    {
      baseURL: '/api',
    },
  );

  return res;
}

async function login(member: TMember, password: string) {
  const res = api.post(
    '/auth/login',
    { member, password },
    { baseURL: '/api' },
  );

  return res;
}

async function logout() {
  const res = await api.post('/auth/logout', {}, { baseURL: '/api' });

  return res;
}

export { login, logout, getMemberInfo };
