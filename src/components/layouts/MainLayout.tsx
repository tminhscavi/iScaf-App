'use client';

import { MsalProvider } from '@azure/msal-react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import InitialClient from '../InititalClient';
import { Toaster } from '../ui/sonner';
import { msalConfig } from '@/constants/msalConfig';
import { PublicClientApplication } from '@azure/msal-browser';

export default function MainLayout({ children }: { children: any }) {
  const msalInstance = new PublicClientApplication(msalConfig);

  return (
    <div className="max-w-[475px] min-h-screen max-h-screen overflow-hidden mx-auto">
      <Toaster position="top-center" />
      <InitialClient />
      <MsalProvider instance={msalInstance}>{children}</MsalProvider>
    </div>
  );
}
