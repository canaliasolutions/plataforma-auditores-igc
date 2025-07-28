"use client";

import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ReportGenerationModal.module.css";

interface ReportGenerationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  auditName: string;
}

export function ReportGenerationModal({
  onClose,
  onConfirm,
  auditName,
}: ReportGenerationModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <div className={styles["modal-header"]}>
          <h3 className={styles["modal-title"]}>Subir informe</h3>
          <button onClick={onClose} className={styles["close-button"]}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <div className={styles["modal-body"]}>
          <WarningIcon
            className={styles["warning-icon"]}
            sx={{ fontSize: 48 }}
          />
          <div className={styles["warning-content"]}>
            <h4 className={styles["warning-title"]}>Confirmación Requerida</h4>
            <p className={styles["warning-message"]}>
              Está a punto de subir el informe final de auditoría para:
            </p>
            <div className={styles["audit-info"]}>
              <strong>{auditName}</strong>
            </div>
            <div className={styles["important-notice"]}>
              <p className={styles["notice-text"]}>
                <strong>Importante:</strong> Esta acción es <strong>definitiva</strong> y no se puede deshacer. Una vez
                generado el informe final:
              </p>
              <ul className={styles["notice-list"]}>
                <li>No se podrán agregar más hallazgos</li>
                <li>No se podrán modificar los hallazgos existentes</li>
                <li>El estado de la auditoría cambiará a "Completada"</li>
              </ul>
            </div>
            <p className={styles["confirmation-question"]}>
              ¿Está seguro de que desea proceder con la subida de datos del informe
              final?
            </p>
          </div>
        </div>

        <div className={styles["modal-footer"]}>
          <button onClick={onClose} className={styles["cancel-button"]}>
            Cancelar
          </button>
          <button onClick={handleConfirm} className={styles["confirm-button"]}>
            Sí, enviar datos
          </button>
        </div>
      </div>
    </div>
  );
}
