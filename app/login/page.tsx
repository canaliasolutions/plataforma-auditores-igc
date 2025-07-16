"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { Login } from "@/components/login";

export default function LoginPage() {
  const { accounts } = useMsal();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (accounts.length > 0) {
      router.push("/dashboard");
    }
  }, [accounts, router]);

  const handleLoginSuccess = (account: AccountInfo) => {
    // Redirect to dashboard after successful login
    router.push("/dashboard");
  };

  // Don't render login if already authenticated
  if (accounts.length > 0) {
    return null;
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}
