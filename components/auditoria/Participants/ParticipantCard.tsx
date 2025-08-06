import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./Participants.module.css";
import { Participant } from "@/hooks/useParticipants";

interface Props {
  item: Participant;
  onEdit: (p: Participant) => void;
  onDelete: (id: number) => void;
}

export default function ParticipantCard({ item, onEdit, onDelete }: Props) {
  return (
    <div className={styles["participant-card"]}>
      {/* ---- Cabecera ---- */}
      <div className={styles["card-header"]}>
        <div className={styles["participant-info"]}>
          <h3 className={styles["participant-name"]}>{item.nombreCompleto}</h3>

          <div className={styles["participant-details"]}>
            <div className={styles["detail-item"]}>
              <WorkIcon className={styles["detail-icon"]} />
              <span className={styles["detail-text"]}>{item.cargoRol}</span>
            </div>

            <div className={styles["detail-item"]}>
              <EmailIcon className={styles["detail-icon"]} />
              <span className={styles["detail-text"]}>{item.correoElectronico}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Asistencia ---- */}
      <div className={styles["attendance-section"]}>
        <h4 className={styles["attendance-title"]}>Asistencia a reuniones</h4>

        <div className={styles["attendance-items"]}>
          <div className={styles["attendance-item"]}>
            <CheckCircleIcon
              className={`${styles["attendance-icon"]} ${
                item.asistioReunionInicial ? styles["attended"] : styles["not-attended"]
              }`}
            />
            <span className={styles["attendance-text"]}>Reunión inicial</span>
          </div>

          <div className={styles["attendance-item"]}>
            <CheckCircleIcon
              className={`${styles["attendance-icon"]} ${
                item.asistioReunionCierre ? styles["attended"] : styles["not-attended"]
              }`}
            />
            <span className={styles["attendance-text"]}>Reunión de cierre</span>
          </div>
        </div>
      </div>

      {/* ---- Pie ---- */}
      <div className={styles["card-footer"]}>
        <div className={styles["date-section"]}>
          <span className={styles["date-info"]}>
            Agregado el: {new Date(item.fechaAgregado).toLocaleDateString("es-ES")}
          </span>
        </div>

        <div className={styles["action-buttons"]}>
          <button
            onClick={() => onEdit(item)}
            className={styles["edit-button"]}
            title="Editar participante"
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className={styles["delete-button"]}
            title="Eliminar participante"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
