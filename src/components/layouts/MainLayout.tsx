'use client';

import { MsalProvider } from '@azure/msal-react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { msalConfig } from '@/constants/msalConfig';
import { PublicClientApplication } from '@azure/msal-browser';
import InitialClient from '../InititalClient';
import { Toaster } from '../ui/sonner';

export default function MainLayout({ children }: { children: any }) {
  const msalInstance = new PublicClientApplication(msalConfig);

  return (
    <main className="max-w-[475px] flex flex-col min-h-screen max-h-screen overflow-hidden mx-auto">
      <Toaster position="top-center" />
      <InitialClient />
      <MsalProvider instance={msalInstance}>{children}</MsalProvider>
    </main>
  );
}
