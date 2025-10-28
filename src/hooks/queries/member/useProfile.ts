import { TMemberProfile } from '@/types/member';
import { api } from '@/utils/axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

async function getMemberProfile(memberId: string, comp: string) {
  const member: TMemberProfile[] = await api.get(
    `/eoffice/CNYGetMemberInforDetail/CNY01006PK/${memberId}/COMP/${comp}`,
    {
      baseURL: '/api',
    },
  );
  return member[0];
}

export const useMemberProfile = (
  params?: { memberId: string; comp: string },
  options?: UseQueryOptions<TMemberProfile, Error>,
) => {
  return useQuery({
    queryKey: ['member-profile'],
    queryFn: (): Promise<TMemberProfile> =>
      getMemberProfile(params?.memberId || '', params?.comp || ''),
    ...options,
  });
};
