import { useState, useRef, useEffect } from "react";
import styles from "./Tooltip.module.css";

export type TooltipVariant = "info" | "success" | "warning" | "danger";

interface Props {
    content: string;
    variant?: TooltipVariant;
    delay?: number;
    children: React.ReactElement;
    open?: boolean;
    trigger?: "auto" | "manual";
}

export default function Tooltip({
    content,
    children,
    variant = "info",
    delay = 200,
    open,
    trigger = "auto",
}: Props) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRef = useRef<HTMLSpanElement>(null);
    const isVisible = trigger === "manual" ? open : visible;

    /* Limpia temporizador al desmontar */
    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);


    const show = () => {
        timeoutRef.current = setTimeout(() => setVisible(true), delay);
    };
    const hide = () => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setVisible(false);
    };


    return (
        <span
            className={styles.wrapper}
            ref={wrapperRef}
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}
            {isVisible && (
                <span className={`${styles.tooltip} ${styles[variant]}`} role="tooltip">
                    {content}
                    <span className={styles.arrow} />
                </span>
            )}
        </span>
    );
}
