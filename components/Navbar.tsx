"use client";

import styles from "./Navbar.module.css";
import {useRouter} from "next/navigation";
import { useMsal } from "@azure/msal-react";
import {UserSessionData} from "@/lib/session-utils";
import NavbarUser from "@/components/NavbarUserModal";

interface NavbarProps {
  activeTab?: string;
  userSession: UserSessionData | null;
  onTabChange?: (tab: string) => void;
}

export function Navbar({
  activeTab = "auditorias", userSession,
}: NavbarProps) {
  const { instance } = useMsal();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await instance.logoutPopup();
      const response = await fetch('/api/logout', {
        method: 'POST', // Use POST as defined in your API route
      });
      if (!response.ok) {
        throw new Error(`Server logout failed: ${response.statusText}`);
      } else {
        router.push('/login');
        console.log("User successfully logged out (client-side MSAL and server-side session invalidated).");
      }
    } catch (error) {
      console.error("Error during logout process:", error);
    }
  };

  const onTabChange = (tab: string) => {
    // Navigate to different pages based on tab selection
    switch (tab) {
      case "auditorias":
        router.push("/auditorias");
        break;
      default:
        router.push("/auditorias");
    }
  };

  const tabs: {id:string, label:string}[] = [];

  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-container"]}>
        <div className={styles["navbar-brand"]}>
          <h1 className={styles["brand-title"]}>Portal de auditores</h1>
        </div>

        <div className={styles["navbar-menu"]}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles["nav-tab"]} ${activeTab === tab.id ? styles["nav-tab-active"] : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      <NavbarUser name={userSession?.name || "Usuario"}
                  email={userSession?.email || "email.com"}
                    handleLogout={handleLogout} />
      </div>
    </nav>
  );
}
