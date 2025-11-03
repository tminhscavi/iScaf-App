'use client';

import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/queries/sharepoint/useNotification';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { toDateTimeString } from '@/utils/date';
import { Bell } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { member } = useAuthStore();
  const { spToken } = useAppStore();

  const { data: notiData } = useNotifications(
    {
      queryKey: ['user-notifications', member?.EmpCode],
      enabled: !!spToken && !!member?.EmpCode,
    },
    {
      memberCode: member?.EmpCode || '',
    },
  );

  return (
    <AuthenticatedLayout>
      <div className="flex items-center justify-between bg-primary text-white">
        <div className="flex items-center gap-1">
          <Image
            src="/images/iscaf_icon.png"
            alt="iscaf icon"
            width={40}
            height={48}
            priority
          />
          <h1 className="font-bold">iScaF</h1>
        </div>
        {member && (
          <p className="pr-2">
            Xin chào, <span className="font-semibold">{member?.FullName}</span>
          </p>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2 row-start-2">
          <div className="relative grid justify-center mb-5">
            <Image
              className="mx-auto"
              src="/images/logo.png"
              alt="Logo"
              width={320}
              height={240}
              priority
            />
            <Image
              src="/images/scavi.png"
              alt="Logo"
              width={320}
              height={240}
              priority
            />
          </div>
          <Separator className="my-2 bg-primary" />

          <Card className="w-full border-primary shadow-2xl">
            <CardHeader className="font-bold text-xl flex gap-2 items-center text-primary">
              <Bell /> Thông báo mới nhất
            </CardHeader>
            <Separator />
            <CardContent className="gap-4 grid">
              {notiData && notiData.length > 0 ? (
                notiData.slice(0, 3).map((noti) => (
                  <div key={noti.id} className="p-2 border-b">
                    <p className="font-semibold mb-2">{noti.fields.Title}</p>
                    <p className="">{noti.fields.Description}</p>
                    <p className=" text-end text-sm text-gray-600">
                      {toDateTimeString(noti.fields.Created)}
                    </p>
                  </div>
                ))
              ) : (
                <p>Không có thông báo mới</p>
              )}
            </CardContent>
            {/* <CardFooter className="flex-col gap-2">
              <Separator />
            </CardFooter> */}
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
