/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMsal } from '@azure/msal-react';
import * as React from 'react';

const SHAREPOINT_SCOPES = {
  scopes: ['Sites.Read.All', 'User.Read'], // Scopes needed for MS Graph / SharePoint
};

export default function SharePointFetcher() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    // 1. Check if an account is logged in
    const request = {
      ...SHAREPOINT_SCOPES,
      account: accounts[0], // Use the first logged-in account
    };

    if (accounts.length > 0) {
      // 2. ATTEMPT SILENT TOKEN ACQUISITION
      instance
        .acquireTokenSilent(request)
        .then((response: any) => {
          setAccessToken(response.accessToken);
        })
        .catch((error: any) => {
          // 3. IF SILENT FAILS, FALLBACK TO INTERACTIVE ACQUISITION
          if (error) {
            instance.acquireTokenRedirect(request);
          } else {
            console.error('Error acquiring token:', error);
          }
        });
    }
  }, [instance, accounts]);

  if (accessToken) {
    console.log('Access Token:', accessToken);
  }
}
