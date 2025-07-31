"use client";
import styles from "./Hallazgos.module.css";
import { Hallazgo } from "@/types/tipos";
import { getSeverityColor, getSeverityText, getTypeText } from "./helpers";

interface Props {
  item: Hallazgo;
  onEdit: (item: Hallazgo) => void;
  onDelete: (id: number) => void;
}

export default function HallazgoItem({ item, onEdit, onDelete }: Props) {
  return (
    <div className={styles["conformity-card"]}>
      <div className={styles["card-header"]}>
        <div className={styles["title-section"]}>
          <h3 className={styles["conformity-title"]}>{item.evidencia}</h3>
          {item.clausula.label && (
            <span className={styles["clause-badge"]}>Cláusula {item.clausula.label}</span>
          )}
        </div>
        <div className={styles["badges"]}>
          <span className={styles["status-badge"]}>{getTypeText(item.tipo)}</span>
          {item.tipo === "NC" && item.severidad && (
            <span
              className={styles["severity-badge"]}
              style={{ backgroundColor: getSeverityColor(item.severidad) }}
            >
              {getSeverityText(item.severidad)}
            </span>
          )}
        </div>
      </div>

      <p className={styles["conformity-description"]}>{item.descripcion}</p>

      <div className={styles["card-footer"]}>
        <div className={styles["date-section"]}>
          <span className={styles["date-info"]}>
            Encontrada el: {new Date(item.fecha_encontrado).toLocaleDateString("es-ES")}
          </span>
          {item.fecha_resuelto && (
            <span className={styles["date-info"]}>
              Resuelta el: {new Date(item.fecha_resuelto).toLocaleDateString("es-ES")}
            </span>
          )}
        </div>
        <div className={styles["action-buttons"]}>
          <button onClick={() => onEdit(item)} className={styles["edit-button"]}>
            Editar
          </button>
          <button onClick={() => onDelete(item.id)} className={styles["delete-button"]}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
