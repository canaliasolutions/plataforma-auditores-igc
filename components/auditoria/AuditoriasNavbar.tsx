"use client";

import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningIcon from "@mui/icons-material/Warning";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import MergeIcon from "@mui/icons-material/Merge";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import styles from "./AuditoriasNavbar.module.css";

interface AuditSubNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AuditoriasNavbar({
  activeTab,
  onTabChange,
}: AuditSubNavigationProps) {
          const tabs = [
    { id: "resumen", label: "Resumen", icon: AssignmentIcon },
    { id: "participantes", label: "Participantes", icon: PeopleIcon },
    { id: "hallazgos", label: "Hallazgos", icon: WarningIcon },
    { id: "verificacion-datos", label: "Verificación de datos", icon: VerifiedUserIcon },
    { id: "actividades-integradas", label: "Actividades integradas", icon: MergeIcon },
    { id: "conclusiones", label: "Conclusiones", icon: AssignmentTurnedInIcon },
    // { id: "eficacia", label: "Eficacia del método de auditoría", icon: TrendingUpIcon },
    // { id: "conclusions", label: "Conclusiones", icon: AssignmentTurnedInIcon },
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
