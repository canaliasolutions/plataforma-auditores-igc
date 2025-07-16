"use client";

import styles from "./AuditCard.module.css";

interface AuditCardProps {
  client: {
    name: string;
    logo?: string;
  };
  standard: "ISO 27001" | "ISO 9001" | "ISO 14001";
  dateRange: {
    start: string;
    end: string;
  };
  status?: "scheduled" | "in-progress" | "completed" | "pending";
  onClick?: () => void;
}

export function AuditCard({
  client,
  standard,
  stage,
  dateRange,
  status = "scheduled",
  onClick,
}: AuditCardProps) {
  const getStandardColor = (std: string) => {
    switch (std) {
      case "ISO 27001":
        return "#e74c3c"; // Red
      case "ISO 9001":
        return "#2ecc71"; // Green
      case "ISO 14001":
        return "#f39c12"; // Orange
      default:
        return "#00609d"; // Primary
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className={styles["audit-card"]} onClick={onClick}>
      <div className={styles["audit-card-header"]}>
        <div className={styles["client-info"]}>
          <div className={styles["client-logo"]}>
            {client.logo ? (
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className={styles["logo-image"]}
              />
            ) : (
              <div className={styles["logo-placeholder"]}>
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className={styles["client-name"]}>{client.name}</h3>
        </div>
      </div>

      <div className={styles["audit-card-body"]}>
        <div className={styles["standard-info"]}>
          <span className={styles["standard-badge"]}>{standard}</span>
          <span className={styles["standard-badge"]}>{stage}</span>
        </div>

        <div className={styles["date-info"]}>
          <div className={styles["date-item"]}>
            <span className={styles["date-label"]}>Inicio:</span>
            <span className={styles["date-value"]}>
              {formatDate(dateRange.start)}
            </span>
          </div>
          <div className={styles["date-item"]}>
            <span className={styles["date-label"]}>Fin:</span>
            <span className={styles["date-value"]}>
              {formatDate(dateRange.end)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles["audit-card-footer"]}>
        <span className={styles["duration-info"]}>
          Duración:{" "}
          {Math.ceil(
            (new Date(dateRange.end).getTime() -
              new Date(dateRange.start).getTime()) /
              (1000 * 60 * 60 * 24),
          )}{" "}
          días
        </span>
      </div>
    </div>
  );
}
