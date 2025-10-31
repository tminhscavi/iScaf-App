/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useAuthStore } from '@/store/authStore';
import NavigationBar from './sections/NavigationBar';
import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { NAVIGATION_ROUTES } from '@/constants/route';

export default function AuthenticatedLayoutWithHeader({
  children,
}: {
  children: any;
}) {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const navigate = useRouter();

  const onClickBack = () => {
    navigate.back();
  };

  if (!isAuthenticated) {
    return children;
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 w-full h-[7vh] bg-primary">
        <div
          className="pl-1 w-13 h-full cursor-pointer hover:opacity-80 transition-all duration-300 hover:pl-0 border-r-2"
          onClick={onClickBack}
        >
          <ChevronLeft className="h-full w-10 text-white" />
        </div>
        <p className="text-xl text-white font-semibold">
          {NAVIGATION_ROUTES.find((route) => route.path === pathname)?.label}
        </p>
      </div>
      {/* Main */}
      <div className="overflow-y-auto grow">{children}</div>
      {/* Bottom Nav */}
      <NavigationBar />
    </>
  );
}
