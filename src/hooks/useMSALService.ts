/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DEFAULT_ACCOUNT, MSALPermissionReq } from '@/constants/msalConfig';
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
  const { instance, accounts, inProgress } = useMsal();

  const loginSharePoint = async () => {
    try {
 
      if (accounts.length > 0) return;
      //  const res=  await instance.loginRedirect(MSALPermissionReq);
      //  instance.setActiveAccount(DEFAULT_ACCOUNT);

      
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Xác thực SharePoint thất bại');
    }
  };
  const authenticateSharePoint = async () => {
    try {
      console.log('inProgress',inProgress);
      
      if (inProgress !== 'none') return;

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
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Kết nối SharePoint thất bại');
    }
  };

  // const initMSALRedirect = async () => {
  //   await instance.handleRedirectPromise().then((response) => {
  //     if (response) {
  //       // ✅ We're back from Microsoft login
  //       instance.setActiveAccount(response.account);
  //       console.log('Login complete:', response.account);
  //     } else {
  //       // Not a redirect — maybe user already has a cached account
  //       const account = instance.getAllAccounts()[0];
  //       if (account) instance.setActiveAccount(account);
  //     }
  //   });
  //   setIsInitMSAL(true);
  // };

  // useEffect(() => {
  //   initMSALRedirect();
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      loginSharePoint();
    }, 1000);
  }, []);

  useEffect(() => {
    console.log('accounts', accounts);

    setTimeout(() => {
      authenticateSharePoint();
    }, 300);
  }, [accounts, pathname]);
}
