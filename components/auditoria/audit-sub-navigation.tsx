"use client";

import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningIcon from "@mui/icons-material/Warning";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import styles from "./AuditSubNavigation.module.css";

interface AuditSubNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AuditSubNavigation({
  activeTab,
  onTabChange,
}: AuditSubNavigationProps) {
          const tabs = [
    { id: "overview", label: "Resumen", icon: AssignmentIcon },
    { id: "participants", label: "Participantes", icon: PeopleIcon },
    { id: "non-conformities", label: "Hallazgos", icon: WarningIcon },
    { id: "data-verification", label: "Verificación de datos", icon: VerifiedUserIcon },
    { id: "eficacia", label: "Eficacia del método de auditoría", icon: TrendingUpIcon },
    { id: "conclusions", label: "Conclusiones", icon: AssignmentTurnedInIcon },
  ];

  return (
    <nav className={styles["sub-navigation"]}>
      <div className={styles["nav-container"]}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles["nav-tab"]} ${activeTab === tab.id ? styles["nav-tab-active"] : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <tab.icon className={styles["tab-icon"]} />
            <span className={styles["tab-label"]}>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
