'use client';

import InstallButton from '@/components/InstallButton';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import PWAFeatures from '@/components/PWAFeatures';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { loginRequest } from '@/constants/msalConfig';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const { isLoading, setIsLoading } = useAppStore();
  const { logout } = useAuth();
  const { member } = useAuthStore();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { instance, accounts } = useMsal();
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListItems = async () => {
    setLoading(true);
    try {
      if (accounts.length > 0) {
        // Get access token
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        // Fetch SharePoint list items
        const siteId =
          'scavigroup.sharepoint.com,11e1b152-a183-43f0-bc6e-927f1d96a61f,1baeb911-b152-4cf6-b567-05ca4a634eb9';
        const listId = '6b537779-1466-44db-80f5-f39c4c104a21';

        const listData = await axios.get(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields`,
          {
            headers: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          },
        );

        setListItems(listData.data.value);
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSharePoint = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const onLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (e) {
      console.log('logout', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <main className="grid justify-center min-h-screen">
        <div className="flex flex-col gap-4 row-start-2 items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={320}
            height={240}
            priority
          />

          <Separator />
          <p>Xin chào, {member?.FullName}</p>
          <Card className="w-full">
            <CardContent className="gap-4 grid">
              {/* <InstallButton />
            <PWAFeatures /> */}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Separator />
              <Button
                variant={'destructive'}
                onClick={onLogout}
                className="w-full"
                disabled={isLoading}
              >
                Đăng xuất
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
