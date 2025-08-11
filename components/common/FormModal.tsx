import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./FormModal.module.css";
import { createPortal } from "react-dom";

interface FormModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    submitButtonText: string;
    children: ReactNode;
    cancelButtonText?: string;
}

export function FormModal({
    isOpen,
    title,
    onClose,
    onSubmit,
    submitButtonText,
    children,
    cancelButtonText = "Cancelar"
}: FormModalProps) {
    if (!isOpen) return null;

    const modalContent = (
        <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
                <div className={styles["modal-header"]}>
                    <h3 className={styles["modal-title"]}>{title}</h3>
                    <button
                        onClick={onClose}
                        className={styles["close-button"]}
                        type="button"
                    >
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </button>
                </div>
                <form onSubmit={onSubmit} className={styles["add-form"]}>
                    {children}
                    <div className={styles["form-actions"]}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles["cancel-button"]}
                        >
                            {cancelButtonText}
                        </button>
                        <button
                            type="submit"
                            className={styles["submit-button"]}
                        >
                            {submitButtonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.querySelector("#modal-root") as HTMLElement);
}

