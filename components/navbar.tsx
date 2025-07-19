"use client";

import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import styles from "./Navbar.module.css";
import {useRouter} from "next/navigation";

interface NavbarProps {
  account: AccountInfo;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Navbar({
  account,
  activeTab = "auditorias",
}: NavbarProps) {

  const { instance } = useMsal();
  const router = useRouter();
  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  const onTabChange = (tab: string) => {
    // Navigate to different pages based on tab selection
    switch (tab) {
      case "auditorias":
        router.push("/dashboard");
        break;
      default:
        router.push("/dashboard");
    }
  };

  const tabs = [{ id: "auditorias", label: "Auditorías" }];

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

        <div className={styles["navbar-user"]}>
          <div className={styles["user-info"]}>
            <div className={styles["user-avatar"]}>
              {account.name ? account.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className={styles["user-details"]}>
              <span className={styles["user-name"]}>
                {account.name || "Usuario"}
              </span>
              <span className={styles["user-email"]}>{account.username}</span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles["logout-btn"]}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
