import { api } from '@/utils/axios';

async function getFactories() {
  const response = await api.get('/eoffice/CNY_GetFactoryByCompany/COMP/*');
  return response;
}

export { getFactories };
