/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useAuthStore } from '@/store/authStore';
import NavigationBar from './sections/NavigationBar';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthenticatedLayoutWithHeader({
  children,
}: {
  children: any;
}) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useRouter();

  const onClickBack = () => {
    navigate.back();
  };

  if (!isAuthenticated) {
    return children;
  }

  return (
    <>
      <div className="w-full h-[7vh] bg-primary">
        <div
          className="pl-1 w-10 h-full max-w-10 cursor-pointer hover:opacity-80 transition-all duration-300 hover:pl-0"
          onClick={onClickBack}
        >
          <ChevronLeft className="h-full w-10 text-white" />
        </div>
      </div>
      <div className="overflow-y-auto h-[83vh]">{children}</div>
      <NavigationBar />
    </>
  );
}
