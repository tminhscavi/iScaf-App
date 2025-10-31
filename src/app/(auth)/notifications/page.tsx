'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/queries/sharepoint/useNotification';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { toDateTimeString } from '@/utils/date';

export default function NotificationPage() {
  const { member } = useAuthStore();
  const { spToken } = useAppStore();

  const { data: notiData, isLoading } = useNotifications(
    {
      queryKey: ['user-notifications', member?.EmpCode],
      enabled: !!spToken && !!member,
    },
    {
      memberCode: member?.EmpCode || '',
    },
  );

  return (
    <div className="flex flex-col gap-4 row-start-2 items-center p-4">
      {isLoading && <Skeleton className="w-full h-[80vh]" />}
      {notiData && notiData.length > 0 ? (
        notiData.map((noti) => (
          <div key={noti.id}>
            <div className="p-2">
              <p className="font-semibold mb-2">{noti.fields.Title}</p>
              <p className="">{noti.fields.Description}</p>
              <p className=" text-end text-sm text-gray-600">
                {toDateTimeString(noti.fields.Created)}
              </p>
            </div>
            <Separator className="bg-primary" />
          </div>
        ))
      ) : (
        <p>Không có thông báo nào</p>
      )}
    </div>
  );
}
