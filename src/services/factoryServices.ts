import { api } from '@/utils/axios';

async function getFactories() {
  const response = await api.get('/Eoffice/CNY_GetFactoryByCompany/COMP/*');
  return response;
}

export { getFactories };
