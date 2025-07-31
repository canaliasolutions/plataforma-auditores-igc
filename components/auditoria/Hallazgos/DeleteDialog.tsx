"use client";
import styles from "./Hallazgos.module.css";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteDialog({ open, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["delete-dialog"]}>
        <h3 className={styles["delete-title"]}>Confirmar Eliminación</h3>
        <p className={styles["delete-message"]}>
          ¿Estás seguro de que deseas eliminar este hallazgo? Esta acción no se puede deshacer.
        </p>
        <div className={styles["delete-actions"]}>
          <button onClick={onCancel} className={styles["cancel-button"]}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={styles["confirm-delete-button"]}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
