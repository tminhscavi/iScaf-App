'use client';

import InstallButton from '@/components/InstallButton';
import PWAFeatures from '@/components/PWAFeatures';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

export default function Home() {
  const { isLoading, setIsLoading } = useAppStore();
  const { logout } = useAuth();
  const { member } = useAuthStore();
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
    <div className="grid justify-center min-h-screen">
      <main className="flex flex-col gap-4 row-start-2 items-center">
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
            <InstallButton />
            <PWAFeatures />
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
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
