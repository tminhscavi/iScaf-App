'use client';

import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { loginRequest } from '@/constants/msalConfig';
import { useNotifications } from '@/hooks/queries/sharepoint/useNotification';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { toDateTimeString } from '@/utils/date';
import { useMsal } from '@azure/msal-react';
import { getCookie, setCookie } from 'cookies-next/client';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const { member } = useAuthStore();
  const { spToken, setSPToken } = useAppStore();
  const { instance, accounts } = useMsal();
  const { data: notiData } = useNotifications(
    {
      queryKey: ['user-notifications', member?.EmpCode],
      enabled: !!spToken && !!member,
    },
    {
      memberCode: member?.EmpCode || '',
    },
  );

  const [loading, setLoading] = useState(false);

  const authenticateSharePoint = async () => {
    try {
      const cookieSPToken = getCookie('msal-token');

      if (cookieSPToken) {
        return setSPToken(cookieSPToken);
      }

      if (accounts.length > 0) {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        setCookie('msal-token', response.accessToken, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        });
        return setSPToken(response.accessToken);
      }

      const account = await instance.loginPopup(loginRequest);
      setCookie('msal-token', account.accessToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      setSPToken(account.accessToken);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Kết nối SharePoint thất bại');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      authenticateSharePoint();
    }, 300);
  }, []);

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
