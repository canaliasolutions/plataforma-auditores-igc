import { Hallazgo } from "@/schemas/types";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Hallazgos.module.css";
import { apartados } from "@/constants/apartados";
import {createPortal} from "react-dom";

interface HallazgoModalProps {
    isOpen: boolean;
    title: string;
    hallazgo: Hallazgo;
    submitButtonText: string;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onHallazgoChange: (hallazgo: Partial<Hallazgo>) => void;
}

export function HallazgoModal({
    isOpen,
    title,
    hallazgo,
    submitButtonText,
    onClose,
    onSubmit,
    onHallazgoChange
}: HallazgoModalProps) {
    if (!isOpen) return null;

    const modalContent = (
        <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
                <div className={styles["modal-header"]}>
                    <h3 className={styles["modal-title"]}>{title}</h3>
                    <button
                        onClick={onClose}
                        className={styles["close-button"]}
                    >
                        <CloseIcon sx={{fontSize: 20}}/>
                    </button>
                </div>

                <form
                    onSubmit={onSubmit}
                    className={styles["add-form"]}
                >
                    <div className={styles["form-group"]}>
                        <label className={styles["form-label"]}>Evidencia:</label>
                        <input
                            type="text"
                            value={hallazgo.proceso || ''}
                            onChange={(e) => onHallazgoChange({ proceso: e.target.value })}
                            className={styles["form-input"]}
                            required
                        />
                    </div>

                    <div className={styles["form-group"]}>
                        <label className={styles["form-label"]}>Descripción:</label>
                        <textarea
                            value={hallazgo.descripcion || ''}
                            onChange={(e) => onHallazgoChange({ descripcion: e.target.value })}
                            className={styles["form-textarea"]}
                            rows={4}
                            required
                        />
                    </div>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]}>Tipo:</label>
                            <select
                                value={hallazgo.tipo || ''}
                                onChange={(e) => onHallazgoChange({ tipo: e.target.value })}
                                className={styles["form-select"]}
                                required
                            >
                                <option value="OB">Observación</option>
                                <option value="NC">No conformidad</option>
                                <option value="OM">Oportunidad de mejora</option>
                                <option value="PF">Punto fuerte</option>
                            </select>
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]}>Cláusula:</label>
                            <select
                                value={hallazgo.id_clausula || ''}
                                onChange={(e) => onHallazgoChange({
                                    id_clausula: e.target.value,
                                    label_clausula: e.target.options[e.target.selectedIndex].text
                                })}
                                className={styles["form-select"]}
                                disabled={hallazgo.tipo !== "NC"}
                                required={hallazgo.tipo === "NC"}
                            >
                                <option value="">Seleccione una cláusula</option>
                                {apartados.map((apartado) => (
                                    <option key={apartado.id} value={String(apartado.id)}>
                                        {apartado.clausula}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]}>Severidad:</label>
                            <select
                                value={hallazgo.severidad || ''}
                                onChange={(e) => onHallazgoChange({ severidad: e.target.value })}
                                className={styles["form-select"]}
                                disabled={hallazgo.tipo !== "NC"}
                                required={hallazgo.tipo === "NC"}
                            >
                                <option value=""></option>
                                <option value="menor">Menor</option>
                                <option value="mayor">Mayor</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles["form-actions"]}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles["cancel-button"]}
                        >
                            Cancelar
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

    return createPortal(modalContent, document.querySelector("#modal-root") as HTMLElement)
}
