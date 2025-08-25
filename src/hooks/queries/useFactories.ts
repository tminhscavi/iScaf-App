import { TFactory } from '@/types/factory';
import { api } from '@/utils/axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

async function getFactories() {
  const factory: TFactory[] = await api.get('/eoffice/factory', {
    baseURL: '/api',
  });
  return factory;
}

export const useFactories = (options?: UseQueryOptions<TFactory[], Error>) => {
  return useQuery({
    queryKey: ['factories'],
    queryFn: (): Promise<TFactory[]> => getFactories(), //getFactories()
    ...options,
  });
};
