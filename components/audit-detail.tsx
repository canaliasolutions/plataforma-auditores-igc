"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuditSubNavigation } from "./audit-sub-navigation";
import { NonConformities } from "./non-conformities";
import { Files } from "./files";
import { Participants } from "./participants";
import { DataVerification } from "./data-verification";
import { ReportGenerationModal } from "./report-generation-modal";
import styles from "./AuditDetail.module.css";
import {Audit} from "@/types/audit";

interface AuditDetailProps {
  audit: Audit | null;
}

export function AuditDetail({ audit }: AuditDetailProps) {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showReportModal, setShowReportModal] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

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

  const getDuration = () => {
    const start = new Date(audit.startDate);
    const end = new Date(audit.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
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
                  <span className={styles["info-label"]}>Tipo:</span>
                  <span className={styles["info-value"]}>{audit.type}</span>
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Duración:</span>
                  <span className={styles["info-value"]}>
                    {getDuration()} días
                  </span>
                </div>
              </div>

              <div className={styles["info-card"]}>
                <h3 className={styles["info-title"]}>Alcance</h3>
                <p className={styles["description"]}>{audit.scope}</p>
              </div>
            </div>
          </div>
        );
                  case "non-conformities":
        return <NonConformities auditId={audit.id} />;
      case "participants":
        return <Participants auditId={audit.id} />;
      case "data-verification":
        return <DataVerification auditId={audit.id} />;
      case "files":
        return <Files auditId={audit.id} />;
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
                  <span className={styles["standard-badge"]} style={{"backgroundColor": getStandardColor(audit.standard)}}>
                    {audit.standard}
                  </span>
                  <span className={styles["stage-badge"]}>{audit.stage}</span>
                </div>
              </div>
            </div>

            <div className={styles["date-section"]}>
              <div className={styles["date-item"]}>
                <span className={styles["date-label"]}>Fecha de inicio:</span>
                <span className={styles["date-value"]}>
                  {formatDate(audit.startDate)}
                </span>
              </div>
              <div className={styles["date-item"]}>
                <span className={styles["date-label"]}>Fecha de fin:</span>
                <span className={styles["date-value"]}>
                  {formatDate(audit.endDate)}
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
            console.log("Generating report for audit:", audit.id);
            setShowReportModal(false);
          }}
          auditName={audit.client.name}
        />
      )}
    </div>
  );
}
