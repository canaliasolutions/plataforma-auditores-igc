"use client";

import { useRouter } from "next/navigation";
import { AccountInfo } from "@azure/msal-browser";
import { Navbar } from "./navbar";
import { Dashboard } from "./dashboard";
import styles from "./MainApp.module.css";

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
    <div className={styles["main-app"]}>
      <Navbar
        account={account}
        activeTab="auditorias"
        onTabChange={handleTabChange}
      />
      <main className={styles["main-content"]}>
        <Dashboard />
      </main>
    </div>
  );
}
