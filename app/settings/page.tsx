"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";
import { Navbar } from "@/components/navbar";

export default function SettingsPage() {
  const { accounts } = useMsal();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (accounts.length === 0) {
      router.push("/login");
    }
  }, [accounts, router]);

  // Don't render if not authenticated
  if (accounts.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Redirecting to login...</div>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    router.push(`/${tab === "auditorias" ? "dashboard" : tab}`);
  };

  return (
    <div className="main-app">
      <Navbar
        account={accounts[0]}
        activeTab="settings"
        onTabChange={handleTabChange}
      />
      <main className="main-content">
        <div className="page-placeholder">
          <h2>Configuración del Sistema</h2>
          <p>Módulo en desarrollo...</p>
        </div>
      </main>
    </div>
  );
}
