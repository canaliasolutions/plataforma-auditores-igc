"use client";

import { useRouter } from "next/navigation";
import { AccountInfo } from "@azure/msal-browser";
import { Navbar } from "./navbar";
import { Dashboard } from "./dashboard";

interface MainAppProps {
  account: AccountInfo;
}

export function MainApp({ account }: MainAppProps) {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    // Navigate to different pages based on tab selection
    switch (tab) {
      case "auditorias":
        router.push("/dashboard");
        break;
      default:
        router.push("/dashboard");
    }
  };

  return (
    <div className="main-app">
      <Navbar
        account={account}
        activeTab="auditorias"
        onTabChange={handleTabChange}
      />
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
}
