import { useState, useRef, useEffect } from "react";
import styles from "./Tooltip.module.css";

export default function Tooltip({
    content,
    variant = "info",
    delay = 200,
    autoClose = 0,
    trigger = "auto",
    open,
    placement = "top",
    children,
    onHide
}: {
    content: string;
    variant?: "info" | "success" | "warning" | "danger";
    delay?: number;
    autoClose?: number;
    trigger?: "auto" | "manual";
    open?: boolean;
    placement?: "top" | "bottom";
    children: React.ReactElement;
    onHide?: () => void
}) {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    /* ——— sincroniza estado controlado ——— */
    useEffect(() => {
        if (trigger === "manual") setVisible(Boolean(open));
    }, [open, trigger]);

    /* ——— autocierre ——— */
    useEffect(() => {
        if (autoClose > 0 && visible) {
            const id = setTimeout(() => setVisible(false), autoClose);
            return () => clearTimeout(id);
        }
    }, [visible, autoClose]);

    useEffect(() => {
        if (autoClose > 0 && visible) {
            const id = setTimeout(() => {
                setVisible(false);
                onHide?.();
            }, autoClose);
            return () => clearTimeout(id);
        }
    }, [visible, autoClose, onHide]);

    /* ——— gestiona delay ——— */
    const show = () => {
        clearTimeout(timerRef.current as NodeJS.Timeout);
        timerRef.current = setTimeout(() => setVisible(true), delay);
    };
    const hide = () => {
        clearTimeout(timerRef.current as NodeJS.Timeout);
        setVisible(false);
    };

    const isVisible = visible;            // ← ahora sólo miramos el estado interno

    return (
        <span
            className={styles.wrapper}
            onMouseEnter={trigger === "auto" ? show : undefined}
            onMouseLeave={trigger === "auto" ? hide : undefined}
            onFocus={trigger === "auto" ? show : undefined}
            onBlur={trigger === "auto" ? hide : undefined}
        >
            {children}

            {isVisible && (
                <span
                    className={`${styles.tooltip} ${styles[variant]} ${styles[placement]}`}
                    role="tooltip"
                >
                    {content}
                    <span className={styles[`arrow-${placement}`]} />
                </span>
            )}
        </span>
    );
}
