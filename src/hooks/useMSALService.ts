/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { MSALPermissionReq } from '@/constants/msalConfig';
import { useAppStore } from '@/store/appStore';
import { useMsal } from '@azure/msal-react';
import { getCookie, setCookie } from 'cookies-next/client';
import { decodeJwt } from 'jose';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function useMSAL() {
  const pathname = usePathname();
  const { spToken, setSPToken } = useAppStore();
  const { instance, accounts } = useMsal();

  const authenticateSharePoint = async () => {
    try {
      const now = new Date();
      const cookieSPToken = getCookie('msal-token');

      if (cookieSPToken) {
        const decodedCookie = decodeJwt(cookieSPToken as string) as any;
        if (!spToken && decodedCookie.exp * 1000 > now.getTime()) {
          return setSPToken(cookieSPToken);
        }
      }

      if (accounts.length > 0) {
        const res = await instance.ssoSilent(MSALPermissionReq);
        setCookie('msal-token', res.accessToken, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        });
        return setSPToken(res.accessToken);
      }

      await instance.loginRedirect(MSALPermissionReq);
      // if (res) {
      //   setCookie('msal-token', res.accessToken, {
      //     maxAge: 60 * 60 * 24 * 30,
      //     path: '/',
      //   });
      //   setSPToken(res.accessToken);
      // }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Kết nối SharePoint thất bại');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      authenticateSharePoint();
    }, 300);
  }, [pathname]);
}
