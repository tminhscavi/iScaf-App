/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toaster } from '../ui/sonner';

export default function MainLayout({ children }: { children: any }) {
  return (
     <div className="max-w-[475px] min-h-screen mx-auto">
      <Toaster position='top-center' />
      {children}
    </div>
  );
}
