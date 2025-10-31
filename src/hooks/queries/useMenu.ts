import { getMenuByMember } from '@/services';
import { TMenuItems } from '@/types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useMenu = (
  params?: { comp: string; memberId: string },
  options?: UseQueryOptions<TMenuItems[], Error>,
) => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: async (): Promise<TMenuItems[]> =>
      await getMenuByMember(params?.comp || '', params?.memberId || ''),
    ...options,
  });
};
