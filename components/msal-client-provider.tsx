"use client";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/lib/auth-config";
import { ReactNode } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

interface MsalClientProviderProps {
  children: ReactNode;
}

export function MsalClientProvider({ children }: MsalClientProviderProps) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}