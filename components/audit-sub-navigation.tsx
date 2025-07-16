"use client";

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
    { id: "overview", label: "Resumen", icon: "📋" },
    { id: "non-conformities", label: "No Conformidades", icon: "⚠️" },
    { id: "files", label: "Archivos", icon: "📁" },
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
            <span className={styles["tab-icon"]}>{tab.icon}</span>
            <span className={styles["tab-label"]}>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
