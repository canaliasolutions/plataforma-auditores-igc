"use client";
import styles from "./DeleteDialog.module.css";

interface DeleteDialogProps {
    onDelete: () => void;
    onCancel: () => void;
}

export function DeleteDialog({onDelete, onCancel}: DeleteDialogProps) {

    return (
        <div className={styles["modal-overlay"]}>
            <div className={styles["delete-dialog"]}>
                <div className={styles["delete-header"]}>
                    <h3 className={styles["delete-title"]}>Confirmar Eliminación</h3>
                </div>

                <div className={styles["delete-content"]}>
                    <p className={styles["delete-message"]}>
                        ¿Estás seguro de que deseas eliminar este elemento? Esta
                        acción no se puede deshacer.
                    </p>
                </div>

                <div className={styles["delete-actions"]}>
                    <button
                        onClick={onCancel}
                        className={styles["cancel-button"]}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onDelete}
                        className={styles["confirm-delete-button"]}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}