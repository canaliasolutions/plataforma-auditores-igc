import { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "", // This should be your Azure App Registration Client ID
    authority: "https://login.microsoftonline.com/"+process.env.NEXT_PUBLIC_AZURE_TENANT_ID, // This allows both personal and work accounts
    redirectUri: process.env.NEXT_PUBLIC_BASE_URL+"/auth.html",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest: PopupRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

// Graph API endpoint
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphProfilePhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
};
