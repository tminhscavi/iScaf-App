import { api } from '@/utils/axios';

async function getMenuByMember(comp: string, member: string) {
  const response = await api.get(
    `eoffice/Eoffice_Get_ReceiptMember/COMP/${comp}/EOFFICE/10/MEMBER/${member}`,
    {
      baseURL: '/api',
    },
  );
  return response;
}

export { getMenuByMember };
