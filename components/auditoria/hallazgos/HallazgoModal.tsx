import { Hallazgo } from "@/schemas/types";
import { apartados } from "@/constants/apartados";
import { useEffect } from "react";
import { FormModal } from "@/components/common/FormModal";
import styles from "@/components/common/FormModal.module.css";

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

    useEffect(() => {
        if (hallazgo.tipo !== 'No conformidad') {
            if (hallazgo.tipo === 'Observación') {
                onHallazgoChange({
                    severidad: ''
                });
            } else {
                onHallazgoChange({
                    label_clausula: '',
                    id_clausula: '',
                    severidad: ''
                });
            }
        }
    }, [hallazgo.tipo]);

    return (
        <FormModal
            isOpen={isOpen}
            title={title}
            onClose={onClose}
            onSubmit={onSubmit}
            submitButtonText={submitButtonText}
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
                    <label className={styles["form-label"]} >Tipo:</label>
                    <select
                        value={hallazgo.tipo || ''}
                        onChange={(e) => onHallazgoChange({ tipo: e.target.value })}
                        className={styles["form-select"]}
                        required
                    >
                        <option value="Observación">Observación</option>
                        <option value="No conformidad">No conformidad</option>
                        <option value="Oportunidad de mejora">Oportunidad de mejora</option>
                        <option value="Punto fuerte">Punto fuerte</option>
                    </select>
                </div>
                <div className={styles["form-group"]}>
                    <label className={styles["form-label"]} >Requisito:</label>
                    <select
                        value={hallazgo.id_clausula || ''}
                        onChange={(e) => onHallazgoChange({
                            id_clausula: e.target.value,
                            label_clausula: e.target.options[e.target.selectedIndex].text
                        })}
                        className={styles["form-select"]}
                        disabled={hallazgo.tipo !== "No conformidad" && hallazgo.tipo !== "Observación"}
                        required={hallazgo.tipo === "No conformidad" || hallazgo.tipo === "Observación"}
                    >
                        <option value="">Seleccione requisito</option>
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
                        disabled={hallazgo.tipo !== "No conformidad"}
                        required={hallazgo.tipo === "No conformidad"}
                    >
                        <option value="">Seleccione severidad</option>
                        <option value="Menor">Menor</option>
                        <option value="Mayor">Mayor</option>
                    </select>
                </div>
            </div>
        </FormModal>
    );
}
