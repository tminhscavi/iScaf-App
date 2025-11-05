/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useAuthStore } from '@/store/authStore';
import NavigationBar from './sections/NavigationBar';

export default function AuthenticatedLayout({ children }: { children: any }) {
  // const { checkUser, login } = useAuth();
  const { isAuthenticated } = useAuthStore();


  if (!isAuthenticated) {
    return children;
  }

  return (
    <>
      <div className="overflow-y-auto grow">{children}</div>
      <NavigationBar />
    </>
  );
}
