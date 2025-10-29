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
import { useMsal } from '@azure/msal-react';
import { setCookie } from 'cookies-next/client';
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
      if (accounts.length > 0) {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        setCookie('msal-token', response.accessToken, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        });
        setSPToken(response.accessToken);
        return;
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
      <main className="min-h-screen p-4">
        <div className="flex flex-col gap-4 row-start-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={320}
            height={240}
            priority
          />

          <Separator className="my-2 bg-primary" />
          <p>Xin chào, {member?.FullName}</p>
          <Card className="w-full">
            <CardHeader className="font-bold">Thông báo mới nhất</CardHeader>
            <Separator />
            <CardContent className="gap-4 grid">
              {notiData && notiData.length > 0 ? (
                notiData.slice(0, 5).map((noti) => (
                  <div key={noti.id} className="p-2 border-b">
                    <p className="font-semibold">{noti.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(noti.created).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>Không có thông báo mới</p>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Separator />
            </CardFooter>
          </Card>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
