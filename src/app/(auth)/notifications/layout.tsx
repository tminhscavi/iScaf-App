'use client';

import AuthenticatedLayoutWithHeader from '@/components/layouts/AuthenticatedLayoutWithHeader';

export default function NotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayoutWithHeader>{children}</AuthenticatedLayoutWithHeader>
  );
}
