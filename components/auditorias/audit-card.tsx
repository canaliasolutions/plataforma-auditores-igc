"use client";

import styles from "./AuditCard.module.css";
import {ResumenAuditoria} from "@/types/tipos";

interface AuditCardProps {
    audit: ResumenAuditoria,
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
                        {audit.cliente.logo ? (
                            <img
                                src={audit.cliente.logo}
                                alt={`${audit.cliente.nombre} logo`}
                                className={styles["logo-image"]}
                            />
                        ) : (
                            <div className={styles["logo-placeholder"]}>
                                {audit.cliente.nombre?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h3 className={styles["client-name"]}>{audit.cliente.nombre}</h3>
                </div>
            </div>

            <div className={styles["audit-card-body"]}>
                <div className={styles["standard-info"]}>
                    <span className={styles["standard-badge"]}
                          style={{"backgroundColor": getStandardColor(audit.norma)}}>{audit.norma}</span>
                    <span className={styles["standard-badge"]}>{audit.etapa}</span>
                </div>

                <div className={styles["date-info"]}>
                    <div className={styles["date-item"]}>
                        <span className={styles["date-label"]}>Inicio:</span>
                        <span className={styles["date-value"]}>
              {new Intl.DateTimeFormat('es-ES', {
                  dateStyle: 'long',
                  timeZone: 'America/Panama',
              }).format(new Date(audit.fechaInicio))}
            </span>
                    </div>
                </div>
            </div>

            <div className={styles["audit-card-footer"]}>
        <span className={styles["duration-info"]}>
          Duración:{" "}
            {Math.ceil(
                (new Date(audit.fechaFinal).getTime() -
                    new Date(audit.fechaInicio).getTime()) /
                (1000 * 60 * 60 * 24),
            ) + 1}{" "}
            día(s)
        </span>
            </div>
        </a>
    );
}
