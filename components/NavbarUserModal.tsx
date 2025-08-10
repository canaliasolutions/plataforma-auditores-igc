import styles from "@/components/Navbar.module.css";
import {useEffect, useRef, useState} from "react";

interface NavbarUserProps {
    email: string;
    name: string;
    handleLogout: () => Promise<void>;
}

export default function NavbarUser({name, email, handleLogout}: NavbarUserProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

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
        <div ref={ref} className={styles["navbar-user"]}>
            <button className={styles["user-info"]} onClick={e => {
                e.stopPropagation();
                setOpen(prev => !prev);
            }}>
                <div className={styles["user-details"]}>
              <span className={styles["user-name"]}>
                {name}
              </span>
                </div>
                <div className={styles["user-avatar"]}>
                    {name.charAt(0).toUpperCase()}
                </div>
            </button>
            {open && (
                <div className={styles["avatar-dropdown-container"]}>
                    <div className={styles["avatar-dropdown-card"]}>
                        <div className={styles["avatar-dropdown-email"]}>{email}</div>
                        <button className={styles["avatar-dropdown-logout"]} onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}