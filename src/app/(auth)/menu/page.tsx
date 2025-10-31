'use client';

import { MAIN_NAVIGATION_MENU_ITEMS } from '@/constants/navigation';
import { useMenu } from '@/hooks/queries/useMenu';
import { useAuthStore } from '@/store/authStore';
import { Cog, ToolCase } from 'lucide-react';
import { useMemo } from 'react';

export default function MenuPage() {
  const { member, companyCode } = useAuthStore();
  const { data } = useMenu(
    { comp: companyCode || '', memberId: member?.EmpCode || '' },
    {
      queryKey: ['menu', member?.EmpCode],
      enabled: !!member && !!companyCode,
    },
  );

  const menuItems = useMemo(() => {
    const userMenuIds = new Set(data?.map((item) => item.CPK));

    return userMenuIds
      ? MAIN_NAVIGATION_MENU_ITEMS?.filter(
          (item) => userMenuIds.has(item.CPK) && item.CPK < 10,
        )
      : [];
  }, [data]);

  return (
    <div className="grid grid-cols-3 justify-items-center px-2 py-4">
      {menuItems.map((item) => (
        <div
          key={item.CPK}
          className="grid text-center w-[120px] h-fit justify-items-center hover:text-primary transition-colors cursor-pointer hover:border-2 p-1 hover:shadow-md"
        >
          <Cog className="w-8 h-8" />
          <p className="font-semibold text-lg">{item.Description}</p>
        </div>
      ))}
    </div>
  );
}
