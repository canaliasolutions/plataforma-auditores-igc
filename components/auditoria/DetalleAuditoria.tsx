"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuditoriasNavbar } from "./AuditoriasNavbar";
import { Hallazgos } from "./hallazgos/Hallazgos";
import { Participantes } from "./participantes/Participantes";
import { DataVerification } from "./verificacion-datos/VerificacionDatos";
import { Eficacia } from "./eficacia";
import { Conclusions } from "./conclusions";
import { ReportGenerationModal } from "./report-generation-modal";
import styles from "./DetalleAuditoria.module.css";
import {Auditoria} from "@/schemas/types";

interface AuditDetailProps {
  auditoria: Auditoria;
}

export default function DetalleAuditoria({ auditoria }: AuditDetailProps) {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("resumen");
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
    const start = new Date(auditoria.fechaInicio);
    const end = new Date(auditoria.fechaFinal);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "resumen":
        return (
          <div className={styles["overview-content"]}>
            <div className={styles["info-grid"]}>
              <div className={styles["info-card"]}>
                <h3 className={styles["info-title"]}>Información General</h3>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Auditor jefe:</span>
                  <span className={styles["info-value"]}>{auditoria.nombreAuditor}</span>
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Ubicación:</span>
                  <span className={styles["info-value"]}>{auditoria.ubicacion}</span>
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Tipo:</span>
                  <span className={styles["info-value"]}>{auditoria.tipo}</span>
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Duración:</span>
                  <span className={styles["info-value"]}>
                    {getDuration()} día(s)
                  </span>
                </div>
              </div>

              <div className={styles["info-card"]}>
                <h3 className={styles["info-title"]}>Alcance</h3>
                <p className={styles["description"]}>{auditoria.alcance}</p>
              </div>
            </div>
          </div>
        );
      case "hallazgos":
        return <Hallazgos auditoria={auditoria} />;
      case "participantes":
        return <Participantes auditoria={auditoria} />;
      case "verificacion-datos":
        return <DataVerification auditId={auditoria.id} />;
      case "eficacia":
        return <Eficacia auditId={auditoria.id} auditoria={auditoria} />;
      case "conclusions":
        return <Conclusions auditId={auditoria.id} auditoria={auditoria} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles["audit-detail"]}>
      <div className={styles["detail-header"]}>
        <button onClick={() => router.push("/auditorias")} className={styles["back-button"]}>
          ← Volver
        </button>
        <div className={styles["header-content"]}>
          <div className={styles["header-main"]}>
            <div className={styles["client-section"]}>
              <div className={styles["client-logo"]}>
                {auditoria.logo_cliente ? (
                  <img
                    src={auditoria.logo_cliente}
                    alt={`${auditoria.nombre_cliente} logo`}
                    className={styles["logo-image"]}
                  />
                ) : (
                  <div className={styles["logo-placeholder"]}>
                    {auditoria.nombre_cliente.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={styles["client-info"]}>
                <h1 className={styles["client-name"]}>{auditoria.nombre_cliente}</h1>
                <div className={styles["audit-meta"]}>
                  <span className={styles["standard-badge"]} style={{"backgroundColor": getStandardColor(auditoria.norma)}}>
                    {auditoria.norma}
                  </span>
                  <span className={styles["stage-badge"]}>{auditoria.etapa}</span>
                </div>
              </div>
            </div>

            <div className={styles["date-section"]}>
              <div className={styles["date-item"]}>
                <span className={styles["date-label"]}>Fecha de inicio:</span>
                <span className={styles["date-value"]}>
                  {formatDate(auditoria.fechaInicio)}
                </span>
              </div>
              <div className={styles["date-item"]}>
                <span className={styles["date-label"]}>Fecha de fin:</span>
                <span className={styles["date-value"]}>
                  {formatDate(auditoria.fechaFinal)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles["header-actions"]}>
            <button
              onClick={() => setShowReportModal(true)}
              className={styles["generate-report-btn"]}
            >
              Enviar resultados
            </button>
          </div>
        </div>
      </div>

      <AuditoriasNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles["detail-content"]}>{renderContent()}</div>

      {showReportModal && (
        <ReportGenerationModal
          onClose={() => setShowReportModal(false)}
          onConfirm={async () => {
            const response = await fetch('/api/informe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({"auditoria": auditoria
              }),
            });
            if (response.ok) {
              alert('Datos de auditoría subidos exitosamente')
            } else {
              alert('Ha habido un error subiendo los datos de auditoría. Si el error persiste, comunícate con soporte@certificacionglobal.com')
            }
            setShowReportModal(false);
          }}
          auditName={auditoria.nombre_cliente}
        />
      )}
    </div>
  );
}
