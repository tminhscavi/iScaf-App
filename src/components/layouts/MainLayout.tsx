/* eslint-disable @typescript-eslint/no-explicit-any */
import InitialClient from '../InititalClient';
import { Toaster } from '../ui/sonner';

export default function MainLayout({ children }: { children: any }) {
  return (
    <div className="max-w-[475px] min-h-screen mx-auto">
      <Toaster position="top-center" />
      <InitialClient />
      {children}
    </div>
  );
}
