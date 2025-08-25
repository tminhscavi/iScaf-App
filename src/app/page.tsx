'use client';

import InstallButton from '@/components/InstallButton';
import PWAFeatures from '@/components/PWAFeatures';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export default function Home() {
  const { logout } = useAuth();
  const onLogout = async () => {
    logout();
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

        <InstallButton />
        <PWAFeatures />
        
        <Separator />
        <Button variant={'destructive'} onClick={onLogout}>
          Đăng xuất
        </Button>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
