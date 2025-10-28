'use client';

import BarcodeScanner from '@/components/BarcodeScanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
import { useFactoryStore } from '@/store/factoryStore';
import { cn } from '@/utils/styles';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import Image from 'next/image';
import { ChangeEvent, useCallback, useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { member, setMember, setCompanyCode } = useAuthStore();
  const { factory, setFactory } = useFactoryStore();
  const { checkUser, login } = useAuth();
  const { data: factories, isLoading: factoryLoading } = useFactories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');

  function formatUsername(value: string, factory: { CompanyCodeHR: string }) {
    const compPrefix = Number(factory.CompanyCodeHR);
    const regex = /^[+-]?(?:0|[1-9]\d*)\.\d{6}$/;

    if (regex.test(value)) {
      return value; // already valid
    }

    // if it's a pure number without dot, format as "1.xxxxxx"
    if (!isNaN(Number(value)) && !value.includes('.')) {
      return `${compPrefix}.${value.toString().padStart(6, '0').slice(0, 6)}`;
    }

    // try to build from CompanyCodeHR + value (non-numeric string case)
    if (factory.CompanyCodeHR && isNaN(Number(value))) {
      const formatted = `${compPrefix}.${value.padStart(6, '0')}`;
      if (regex.test(formatted)) return formatted;
    }

    // fallback
    return `${compPrefix}.000000`;
  }

  const handleChangeUsername = async (value: string) => {
    try {
      setIsSubmitting(true);
      if (factory) {
        const parsedUserName = formatUsername(value, {
          CompanyCodeHR: factory.CompanyCodeHR || '01',
        });
        setUsername(parsedUserName);
        const userInfo = await checkUser(
          factory?.CompanyCodeHR || '01',
          parsedUserName,
        );
        if (userInfo) {
          setMember(userInfo[0]);
          setCompanyCode(factory?.CompanyCodeHR || '01');

          return;
        }
        toast.error('Không tìm thấy thông tin thành viên');
      }
    } catch (e) {
      console.error('LoginPage', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSearch = useCallback(
    debounce(handleChangeUsername, 750),
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
    try {
      setIsSubmitting(true);
      if (member) {
        await login(member, pass);
      }
    } catch (e) {
      console.log('onLogin', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex flex-col min-h-screen items-center justify-center">
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
        <Separator />
        <div className="px-2 grid gap-5">
          <Select
            onValueChange={(value) => onChangeFactory(value)}
            defaultValue={factoryLoading ? '' : factory?.PK}
            disabled={factoryLoading}
          >
            <SelectTrigger className={cn('w-full justify-self-center')}>
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
            <Card className="w-full">
              {/* <CardHeader>
                <CardTitle>Đăng Nhập</CardTitle>
              </CardHeader> */}

              <CardContent>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-end">
                    <p className="font-semibold">MSTV</p>
                    <BarcodeScanner
                      stopAfterFirstScan
                      onScan={(value) => handleChangeUsername(value)}
                    />
                  </div>

                  <Input
                    type="text"
                    value={username}
                    onChange={onChangeUsername}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p className="font-semibold">Mật khẩu</p>
                  <Input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  onClick={onLogin}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Đăng nhập
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
