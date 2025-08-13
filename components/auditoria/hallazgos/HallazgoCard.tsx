import styles from "@/components/auditoria/hallazgos/Hallazgos.module.css";
import {getSeverityColor} from "@/components/auditoria/hallazgos/HallazgosHelper";
import {Hallazgo} from "@/schemas/types";

interface HallazgoCardProps {
    hallazgo: Hallazgo;
    onEditClick: (hallazgo: Hallazgo) => void;
    onDeleteClick: (hallazgoId: number) => void;
}

export function HallazgoCard({hallazgo, onEditClick, onDeleteClick}: HallazgoCardProps) {

    return (
        <div className={styles["conformity-card"]}>
            <div className={styles["card-header"]}>
                <div className={styles["title-section"]}>
                    <h3 className={styles["conformity-title"]}>{hallazgo.proceso}</h3>
                </div>
                <div className={styles["badges"]}>
                                    <span className={styles["status-badge"]}>
                                        {hallazgo.tipo}
                                    </span>
                    {(hallazgo.label_clausula!) ?
                        (<span className={styles["status-badge"]}>
                                            Requisito {hallazgo.label_clausula}
                                        </span>) : null}
                    {hallazgo.tipo === "No conformidad" && hallazgo.severidad && (
                        <span
                            className={styles["severity-badge"]}
                            style={{backgroundColor: getSeverityColor(hallazgo.severidad)}}
                        >
                                            {hallazgo.severidad}
                                        </span>
                    )}
                </div>
            </div>

            <p className={styles["conformity-description"]}>
                {hallazgo.descripcion}
            </p>

            <div className={styles["card-footer"]}>
                <div className={styles["date-section"]}>
                </div>
                <div className={styles["action-buttons"]}>
                    <button
                        onClick={() => onEditClick(hallazgo)}
                        className={styles["edit-button"]}
                        title="Editar hallazgo"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => onDeleteClick(hallazgo.id || 0)}
                        className={styles["delete-button"]}
                        title="Eliminar hallazgo"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}