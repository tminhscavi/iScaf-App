'use client';

import BarcodeScanner from '@/components/BarcodeScanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useFactories } from '@/hooks/queries/useFactories';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { TFactory } from '@/types/factory';
import { cn } from '@/utils/styles';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import Image from 'next/image';
import { ChangeEvent, useCallback, useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { member, setMember } = useAuthStore();
  const { checkUser, login } = useAuth();
  const { data: factories, isLoading: factoryLoading } = useFactories();
  const [factory, setFactory] = useState<TFactory | null>(null);
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');

  const handleChangeUsername = async (value: string) => {
    try {
      const regex = /^[+-]?(?:0|[1-9]\d*)\.\d{6}$/;

      const username = regex.test(value)
        ? value
        : isNaN(Number(value))
        ? `${Number(factory?.CompanyCodeHR)}.${value.padStart(6, '0')}`
        : value;

      const parsedUserName = regex.test(username)
        ? username //`${Number(factory?.CompanyCodeHR)}.000000`
        : Number(
            `${Number(factory?.CompanyCodeHR)}.${username.padStart(6, '0')}`,
          ).toFixed(6);
      setUsername(parsedUserName);
      const userInfo = await checkUser(
        factory?.CompanyCodeHR || '01',
        parsedUserName,
      );
      if (userInfo) {
        setMember(userInfo[0]);
        return;
      }
      toast.error('Không tìm thấy thông tin thành viên');
    } catch (e) {
      console.error('LoginPage', e);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSearch = useCallback(
    debounce(handleChangeUsername, 500),
    [factory],
  );

  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setUsername(query);
    debouncedHandleSearch(query);
  };
  const onChangeFactory = (value: string) => {
    if (factories) {
      const foundFactory = factories.find((factory) => factory.PK === value);
      setFactory(foundFactory || factories[0]);
    }
  };

  const onLogin = async () => {
    if (member) {
      await login(member, pass);
    }
  };

  return (
    <div className="p-2 flex flex-col min-h-screen items-center justify-center">
      <div className="grid gap-4 w-full">
        <motion.div
          className="relative grid justify-center mb-5"
          initial={{
            opacity: 0,
            scale: 1.2,
          }}
          whileInView={{
            scale: 1,
            opacity: 1,
            transition: {
              duration: 1,
              ease: 'easeInOut',
            },
          }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={320}
            height={240}
            priority
          />
          <Image
            src="/images/scavi.png"
            alt="Logo"
            width={320}
            height={240}
            priority
          />
        </motion.div>

        <Select
          onValueChange={(value) => onChangeFactory(value)}
          disabled={factoryLoading}
        >
          <SelectTrigger className={cn('w-[250px] justify-self-center')}>
            <SelectValue placeholder="Chọn nhà máy" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Nhà máy</SelectLabel>
              {factories?.map((factory) => (
                <SelectItem key={factory.PK} value={factory.PK}>
                  {factory.Factory}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {factory && (
          <>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between items-end">
                <p className="font-semibold">MSTV</p>
                <BarcodeScanner
                  stopAfterFirstScan
                  onScan={(value) => handleChangeUsername(value)}
                />
              </div>

              <Input type="text" value={username} onChange={onChangeUsername} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <p className="font-semibold">Mật khẩu</p>
              <Input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <Button onClick={onLogin}>Đăng nhập</Button>
            <Separator />
          </>
        )}
      </div>
    </div>
  );
}
