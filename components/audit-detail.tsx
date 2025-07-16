"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuditSubNavigation } from "./audit-sub-navigation";
import { NonConformities } from "./non-conformities";
import { Files } from "./files";
import { ReportGenerationModal } from "./report-generation-modal";
import styles from "./AuditDetail.module.css";

// Mock data for the audit
const getAuditData = (auditId: string) => {
  const audits = {
    "1": {
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
      description:
        "Auditoría de seguimiento para verificar la implementación de controles de seguridad de la información según ISO 27001.",
      auditor: "María González",
      location: "Ciudad de México, México",
      scope: "Sistema de gestión de seguridad de la información corporativo",
    },
    "2": {
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
      description:
        "Auditoría de renovación del certificado ISO 9001 para el sistema de gestión de calidad.",
      auditor: "Carlos Rodríguez",
      location: "Saltillo, Coahuila",
      scope: "Procesos de manufactura y control de calidad",
    },
  };

  return audits[auditId as keyof typeof audits] || audits["1"];
};

interface AuditDetailProps {
  auditId: string;
}

export function AuditDetail({ auditId }: AuditDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showReportModal, setShowReportModal] = useState(false);

  const audit = getAuditData(auditId);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getDuration = () => {
    const start = new Date(audit.dateRange.start);
    const end = new Date(audit.dateRange.end);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "#f39c12";
      case "in-progress":
        return "#3498db";
      case "completed":
        return "#2ecc71";
      default:
        return "#95a5a6";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Programada";
      case "in-progress":
        return "En Progreso";
      case "completed":
        return "Completada";
      default:
        return "Pendiente";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles["overview-content"]}>
            <div className={styles["info-grid"]}>
              <div className={styles["info-card"]}>
                <h3 className={styles["info-title"]}>Información General</h3>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Auditor:</span>
                  <span className={styles["info-value"]}>{audit.auditor}</span>
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Ubicación:</span>
                  <span className={styles["info-value"]}>{audit.location}</span>
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Alcance:</span>
                  <span className={styles["info-value"]}>{audit.scope}</span>
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Duración:</span>
                  <span className={styles["info-value"]}>
                    {getDuration()} días
                  </span>
                </div>
              </div>

              <div className={styles["info-card"]}>
                <h3 className={styles["info-title"]}>Descripción</h3>
                <p className={styles["description"]}>{audit.description}</p>
              </div>
            </div>
          </div>
        );
      case "non-conformities":
        return <NonConformities auditId={auditId} />;
      case "files":
        return <Files auditId={auditId} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles["audit-detail"]}>
      <div className={styles["detail-header"]}>
        <button onClick={() => router.back()} className={styles["back-button"]}>
          ← Volver
        </button>

        <div className={styles["header-content"]}>
          <div className={styles["header-main"]}>
            <div className={styles["client-section"]}>
              <div className={styles["client-logo"]}>
                {audit.client.logo ? (
                  <img
                    src={audit.client.logo}
                    alt={`${audit.client.name} logo`}
                    className={styles["logo-image"]}
                  />
                ) : (
                  <div className={styles["logo-placeholder"]}>
                    {audit.client.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={styles["client-info"]}>
                <h1 className={styles["client-name"]}>{audit.client.name}</h1>
                <div className={styles["audit-meta"]}>
                  <span className={styles["standard-badge"]}>
                    {audit.standard}
                  </span>
                  <span className={styles["stage-badge"]}>{audit.stage}</span>
                  <span
                    className={styles["status-badge"]}
                    style={{ backgroundColor: getStatusColor(audit.status) }}
                  >
                    {getStatusText(audit.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles["date-section"]}>
              <div className={styles["date-item"]}>
                <span className={styles["date-label"]}>Fecha de inicio:</span>
                <span className={styles["date-value"]}>
                  {formatDate(audit.dateRange.start)}
                </span>
              </div>
              <div className={styles["date-item"]}>
                <span className={styles["date-label"]}>Fecha de fin:</span>
                <span className={styles["date-value"]}>
                  {formatDate(audit.dateRange.end)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles["header-actions"]}>
            <button
              onClick={() => setShowReportModal(true)}
              className={styles["generate-report-btn"]}
            >
              Generar Informe
            </button>
          </div>
        </div>
      </div>

      <AuditSubNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles["detail-content"]}>{renderContent()}</div>

      {showReportModal && (
        <ReportGenerationModal
          onClose={() => setShowReportModal(false)}
          onConfirm={() => {
            // TODO: Implement report generation
            console.log("Generating report for audit:", auditId);
            setShowReportModal(false);
          }}
          auditName={audit.client.name}
        />
      )}
    </div>
  );
}
