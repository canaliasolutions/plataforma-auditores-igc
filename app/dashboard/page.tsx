"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";
import { MainApp } from "@/components/main-app";

export default function DashboardPage() {
  const { accounts } = useMsal();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (accounts.length === 0) {
      router.push("/login");
    }
  }, [accounts, router]);

  // Don't render dashboard if not authenticated
  if (accounts.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Redirecting to login...</div>
      </div>
    );
  }

  return <MainApp account={accounts[0]} />;
}
