"use client";

import AssignmentIcon from "@mui/icons-material/Assignment";
import { AuditCard } from "./audit-card";
import styles from "./Dashboard.module.css";

// Mock data for demonstration
const mockAudits = [
  {
    id: 1,
    client: {
      name: "Banco Nacional de México",
      logo: null,
    },
    stage: "1er Seguimiento",
    standard: "ISO 27001" as const,
    dateRange: {
      start: "2024-12-15",
      end: "2024-12-20",
    },
    status: "scheduled" as const,
  },
  {
    id: 2,
    client: {
      name: "Grupo Industrial Saltillo",
      logo: null,
    },
    stage: "Renovación",
    standard: "ISO 9001" as const,
    dateRange: {
      start: "2024-12-10",
      end: "2024-12-18",
    },
    status: "in-progress" as const,
  },
];

interface DashboardProps {
  searchTerm?: string;
  filterStatus?: string;
  filterStandard?: string;
}

export function Dashboard({}: DashboardProps) {
  const filteredAudits = mockAudits;

  const handleAuditClick = (auditId: number) => {
    window.location.href = `/dashboard/${auditId}`;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles["dashboard-header"]}>
        <h1 className={styles["dashboard-title"]}>Lista de auditorías</h1>
        <p className={styles["dashboard-subtitle"]}>
          Gestiona y supervisa todas las auditorías programadas
        </p>
      </div>

      <div className={styles["dashboard-content"]}>
        {filteredAudits.length === 0 ? (
          <div className={styles["empty-state"]}>
            <AssignmentIcon
              className={styles["empty-icon"]}
              sx={{ fontSize: 64 }}
            />
            <h3 className={styles["empty-title"]}>
              No se encontraron auditorías
            </h3>
            <p className={styles["empty-description"]}>
              No hay auditorías que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className={styles["audit-grid"]}>
            {filteredAudits.map((audit) => (
              <AuditCard
                key={audit.id}
                client={audit.client}
                stage={audit.stage}
                standard={audit.standard}
                dateRange={audit.dateRange}
                status={audit.status}
                onClick={() => handleAuditClick(audit.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
