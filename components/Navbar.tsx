"use client";

import styles from "./Navbar.module.css";
import {usePathname, useRouter} from "next/navigation";
import { useMsal } from "@azure/msal-react";
import NavbarUser from "@/components/NavbarUserModal";
import {useEffect, useState} from "react";

type UserData = {
    name: string | undefined;
    email: string | undefined;
}

export function Navbar() {
  const { instance, accounts } = useMsal();
  const router = useRouter();
  const pathname = usePathname();
  const noNavbarPaths = ['/login'];
  const shouldDisplayNavbar = !noNavbarPaths.includes(pathname);
  const [userData, setUserData] = useState<UserData>();
  const activeTab = pathname.split('/')[1] || 'auditorias';

  useEffect(() => {
    if (accounts.length > 0) {
      const user = accounts[0];
      setUserData({
        name: user.name,
        email: user.username,
      });
    }
  }, [accounts]);

  if (!shouldDisplayNavbar) {
    return null;
  }

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
          <div className={styles["logo-container"]}>
            <img
                alt="IGC Logo"
                src="/sello_redondo_IGC.png"
                height={50}
                width={50}
            />
          </div>
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
      <NavbarUser name={userData?.name || "Usuario"}
                  email={userData?.email || "email.com"}
                    handleLogout={handleLogout} />
      </div>
    </nav>
  );
}
