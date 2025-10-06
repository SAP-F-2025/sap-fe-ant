import Sdk from "casdoor-js-sdk";

export const CasdoorConfig = {
  serverUrl: import.meta.env.VITE_CASDOOR_SERVER_URL || 'http://localhost:8000',
  clientId: import.meta.env.VITE_CASDOOR_CLIENT_ID || '',
  organizationName: import.meta.env.VITE_CASDOOR_ORGANIZATION_NAME || '',
  appName: import.meta.env.VITE_CASDOOR_APP_NAME || '',
  redirectPath: import.meta.env.VITE_CASDOOR_REDIRECT_PATH || '/callback',
};

export const CasdoorSdk = new Sdk(CasdoorConfig);
