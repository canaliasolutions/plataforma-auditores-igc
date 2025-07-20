"use client";

import styles from "./AuditCard.module.css";
import {AuditCardType} from "@/types/audit";

interface AuditCardProps {
    audit: AuditCardType,
    onClick?: () => void,
    href?: string
}

export function AuditCard({
                              audit
                          }: AuditCardProps) {
    const getStandardColor = (std: string) => {
        if (std.includes("27001")) {
            return "#9bddb6"; // Green
        }
        if (std.includes("9001")) {
            return "#a9cee7"; // Blue
        }
        if (std.includes("14001")) {
            return "#efca8b"; // Orange
        }
        return "#7f8c8d"; // Gray
    };

    return (
        <a className={styles["audit-card"]} href={`/auditorias/${audit.id}`}>
            <div className={styles["audit-card-header"]}>
                <div className={styles["client-info"]}>
                    <div className={styles["client-logo"]}>
                        {audit.client.logo ? (
                            <img
                                src={audit.client.logo}
                                alt={`${audit.client.name} logo`}
                                className={styles["logo-image"]}
                            />
                        ) : (
                            <div className={styles["logo-placeholder"]}>
                                {audit.client.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h3 className={styles["client-name"]}>{audit.client.name}</h3>
                </div>
            </div>

            <div className={styles["audit-card-body"]}>
                <div className={styles["standard-info"]}>
                    <span className={styles["standard-badge"]}
                          style={{"backgroundColor": getStandardColor(audit.standard)}}>{audit.standard}</span>
                    <span className={styles["standard-badge"]}>{audit.stage}</span>
                </div>

                <div className={styles["date-info"]}>
                    <div className={styles["date-item"]}>
                        <span className={styles["date-label"]}>Inicio:</span>
                        <span className={styles["date-value"]}>
              {new Intl.DateTimeFormat('es-ES', {
                  dateStyle: 'long',
                  timeZone: 'America/Panama',
              }).format(new Date(audit.startDate))}
            </span>
                    </div>
                </div>
            </div>

            <div className={styles["audit-card-footer"]}>
        <span className={styles["duration-info"]}>
          Duración:{" "}
            {Math.ceil(
                (new Date(audit.endDate).getTime() -
                    new Date(audit.startDate).getTime()) /
                (1000 * 60 * 60 * 24),
            ) + 1}{" "}
            días
        </span>
            </div>
        </a>
    );
}
