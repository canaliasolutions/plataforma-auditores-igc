"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";

interface AvatarDropdownProps {
  name: string;
  email: string;
  onLogout: () => void;
}

export default function AvatarDropdown({ name, email, onLogout }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={styles["avatar-dropdown-container"]}>
      <button className={styles["avatar-dropdown-button"]} onClick={() => setOpen(!open)}>
        {name.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className={styles["avatar-dropdown-card"]}>
          <div className={styles["avatar-dropdown-avatar"]}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div className={styles["avatar-dropdown-name"]}>{name}</div>
          <div className={styles["avatar-dropdown-email"]}>{email}</div>
          <button className={styles["avatar-dropdown-logout"]} onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}