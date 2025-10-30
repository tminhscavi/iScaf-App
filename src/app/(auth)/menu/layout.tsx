'use client';

import AuthenticatedLayoutWithHeader from '@/components/layouts/AuthenticatedLayoutWithHeader';

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayoutWithHeader>{children}</AuthenticatedLayoutWithHeader>
  );
}
