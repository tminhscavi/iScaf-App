'use client';

import { MOBILE_NAVIGATION_MENU } from '@/constants/navigation';
import Link from 'next/link';

export default function NavigationBar() {
  return (
    <div className="w-full h-[10vh] border-primary bg-white z-50 border-y-2  max-w-[480px] flex">
      <div className="grid w-full grid-cols-4 items-center gap-2">
        {MOBILE_NAVIGATION_MENU.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              // onClick={() => onClickItem(item.path)}
              className="hover:opacity-90 cursor-pointer hover:bg-primary hover:text-white transition-colors"
            >
              <div className="flex w-full flex-col items-center gap-1 p-1">
                {item.icon}
                <p className="whitespace-nowrap text-sm">{item.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
