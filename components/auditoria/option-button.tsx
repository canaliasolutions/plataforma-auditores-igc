"use client";

import { ReactNode } from "react";
import styles from "./OptionButton.module.css";

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "correct" | "error" | "warning" | "info";
  className?: string;
}

export function OptionButton({ 
  selected, 
  onClick, 
  icon, 
  children, 
  variant = "default",
  className = ""
}: OptionButtonProps) {
  const variantClass = variant !== "default" ? styles[`option-${variant}`] : "";
  
  return (
    <button
      type="button"
      className={`${styles["option-button"]} ${variantClass} ${
        selected ? styles["option-selected"] : ""
      } ${className}`}
      onClick={onClick}
    >
      {icon && <span className={styles["option-icon"]}>{icon}</span>}
      <span className={styles["option-text"]}>{children}</span>
    </button>
  );
}
