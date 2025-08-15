'use client';

import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');

  const handleChangeUsername = (query: string) => {
    console.log('Fetching results for:', query);
  };

  // Use a useRef to store the debounced function
  const debouncedHandleSearch = useRef(
    debounce(handleChangeUsername, 500),
  ).current;

  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setUsername(query);
    debouncedHandleSearch(query);
  };

  const onLogin = async () => {
    await login(username, pass);
  };

  return (
    <div className="p-2 flex flex-col min-h-screen items-center justify-center">
      <div className="grid gap-4">
        <div className="grid justify-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={240}
            height={180}
            priority
          />
          <Image
            src="/images/scavi.png"
            alt="Logo"
            width={240}
            height={180}
            priority
          />
        </div>
        <div className="flex flex-col gap-2 w-[300px]">
          <p className="font-semibold">MSTV</p>
          <Input type="text" value={username} onChange={onChangeUsername} />
        </div>
        <div className="flex flex-col gap-2 w-[300px]">
          <p className="font-semibold">Mật khẩu</p>
          <Input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>

        <Button onClick={onLogin}>Đăng nhập</Button>

        {/* <Scanner /> */}
      </div>
    </div>
  );
}
