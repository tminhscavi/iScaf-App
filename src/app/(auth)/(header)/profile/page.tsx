'use client';

import InstallButton from '@/components/InstallButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PROFILE_NAVIGATION_MENU } from '@/constants/navigation';
import { useMemberProfile } from '@/hooks/queries/member/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

export default function Member() {
  const { logout } = useAuth();
  const { member, companyCode } = useAuthStore();
  const { isLoading, setIsLoading } = useAppStore();
  const { data: profile } = useMemberProfile(
    {
      memberId: member?.C1006PK || '',
      comp: companyCode || '',
    },
    {
      queryKey: ['member-profile', member?.C1006PK, companyCode],
      enabled: !!member && !!companyCode,
    },
  );

  const onLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (e) {
      console.log('logout', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-4 row-start-2 items-center p-4">
      <Card className="w-full p-1 gap-1 shadow-md bg-blue-50">
        <CardHeader>
          <div className="w-fit h-10 mx-auto">
            <Image
              className="h-full"
              alt={'Scavi'}
              src={'/images/logo-scavi.svg'}
              width={100}
              height={100}
            />
          </div>
        </CardHeader>
        <Separator className="my-1" />
        <CardContent className="gap-4 grid grid-cols-2 justify-center justify-items-center ">
          <div className="flex flex-col gap-1">
            <p className="text-center font-bold">{member?.FullName}</p>
            <p>{member?.EmpCode}</p>
            <p>{member?.Title}</p>
            <p>{member?.Dept}</p>
          </div>
          {member && profile && (
            <div className="rounded-2xl border-2 border-primary w-fit h-[150px]">
              <Image
                className="rounded-2xl h-full"
                alt={member.FullName}
                src={profile.Img}
                width={100}
                height={150}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="w-full">
        {PROFILE_NAVIGATION_MENU.map((item) => (
          <div
            key={item.label}
            className="py-4 flex gap-2 items-center border-b-2 hover:bg-primary hover:text-white cursor-pointer hover:pl-4 px-2 transition-all"
          >
            {item.icon}
            <p className="font-semibold">{item.label}</p>
          </div>
        ))}
      </div>
      <Button
        variant={'destructive'}
        onClick={onLogout}
        className="w-full mt-5"
        disabled={isLoading}
      >
        Đăng xuất
      </Button>
      <InstallButton />
    </main>
  );
}
