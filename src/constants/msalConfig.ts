export const msalConfig = {
  auth: {
    clientId: '47f209b0-c357-45c4-8eb7-62a00350dff4',
    authority:
      'https://login.microsoftonline.com/44c4330c-b963-43ef-a0bc-a03a075da74c',
    redirectUri: 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [' User.Read', 'Sites.Selected'],
};
