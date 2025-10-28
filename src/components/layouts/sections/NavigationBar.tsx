'use client';

import { MOBILE_NAVIGATION_MENU } from '@/constants/navigation';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function NavigationBar() {
  const navigate = useRouter();

  const onClickItem = (path: string) => {
    navigate.push(path);
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        bottom: -20,
      }}
      whileInView={{
        opacity: 1,
        transition: {
          duration: 1,
          ease: 'easeInOut',
        },
        bottom: 0,
      }}
      viewport={{ once: true }}
      className="w-full h-[10vh] border-primary bg-white z-50 border-y-2  max-w-[480px] flex"
    >
      <div className="grid w-full grid-cols-4 items-center gap-2">
        {MOBILE_NAVIGATION_MENU.map((item) => (
          <div
            key={item.path}
            onClick={() => onClickItem(item.path)}
            className="hover:opacity-90 cursor-pointer hover:bg-primary hover:text-white transition-colors"
          >
            <div className="flex w-full flex-col items-center gap-1 p-1">
              {item.icon}
              <p className="whitespace-nowrap text-sm">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
