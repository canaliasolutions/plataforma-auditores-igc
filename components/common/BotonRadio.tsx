"use client";

import { ReactNode } from "react";
import styles from "./BotonRadio.module.css";

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "correcto" | "error" | "warning";
  classNm?: string;
}

export function BotonRadio({
  selected, 
  onClick, 
  icon, 
  children, 
  variant = "default",
  classNm = ""
}: OptionButtonProps) {
  const variantClass = variant !== "default" ? styles[`option-${variant}`] : "";
  
  return (
    <button
      type="button"
      className={`${styles["option-button"]} ${variantClass} ${
        selected ? styles["option-selected"] : ""
      } ${classNm}`}
      onClick={onClick}
    >
      {icon && <span className={styles["option-icon"]}>{icon}</span>}
      <span className={styles["option-text"]}>{children}</span>
    </button>
  );
}
