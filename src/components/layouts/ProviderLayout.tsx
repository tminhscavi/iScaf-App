/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import useMSAL from '@/hooks/useMSAL';

export default function ProviderLayout({ children }: { children: any }) {
  useMSAL();

  return <>{children}</>;
}
