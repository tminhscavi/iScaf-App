export const msalConfig = {
  auth: {
    clientId: '47f209b0-c357-45c4-8eb7-62a00350dff4',
    authority:
      'https://login.microsoftonline.com/44c4330c-b963-43ef-a0bc-a03a075da74c',
    redirectUri:
      process.env.NODE_ENV === 'production'
        ? 'https://iscaf.vercel.app' //process.env.HOST_URL
        : 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const MSALPermissionReq = {
  scopes: [' User.Read', 'Sites.Manage.All'],
};

export const DEFAULT_ACCOUNT = {}

export const SHAREPOINT_SITE_ID =
  'scavigroup.sharepoint.com,11e1b152-a183-43f0-bc6e-927f1d96a61f,1baeb911-b152-4cf6-b567-05ca4a634eb9';

export enum SHAREPOINT_LIST_ENUM {
  API_SERVER_BASE_URL = 'API_SERVER_BASE_URL',
  USER_NOTIFICATION = 'USER_NOTIFICATION',
  DXP = 'DXP',
}

export const SHAREPOINT_LIST = {
  API_SERVER_BASE_URL: {
    id: '6b537779-1466-44db-80f5-f39c4c104a21',
    name: 'API Server',
  },
  USER_NOTIFICATION: {
    id: 'e4a95cc8-998d-4636-8193-ec94c1931ff0',
    name: 'iScafUserNotifications',
  },
  DXP: {
    id: '2b3d5844-e37e-40e4-85d9-f0cce0aedcab',
    name: 'Đơn Xin Phép',
  },
};
