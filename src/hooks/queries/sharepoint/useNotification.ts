import { getNotifications } from '@/services/sharepointServices';
import { TUserNotification } from '@/types/notification';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useNotifications = (
  options?: UseQueryOptions<TUserNotification[], Error>,
  params?: {
    memberCode: string;
  },
) => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<TUserNotification[]> =>
      await getNotifications(params?.memberCode),
    refetchOnWindowFocus: true,
    ...options,
  });
};
