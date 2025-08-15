'use client'

import InstallButton from '@/components/InstallButton';
import PWAFeatures from '@/components/PWAFeatures';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export default function Home() {
  const { logout } = useAuth();
  const onLogout = async () => {
    logout();
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={240}
          height={180}
          priority
        />

        <InstallButton />
        <PWAFeatures />

        <Button onClick={onLogout}>Đăng xuất</Button>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
