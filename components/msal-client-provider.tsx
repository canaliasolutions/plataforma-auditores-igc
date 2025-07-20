// app/providers.tsx (A common place for client-side providers)
"use client";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/lib/auth-config";

// Create the MSAL instance once outside the component to avoid re-instantiation
const msalInstance = new PublicClientApplication(msalConfig);

export function MsalClientProvider({ children }) {

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}