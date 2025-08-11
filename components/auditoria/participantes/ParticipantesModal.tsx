import React from "react";
import styles from "./Participantes.module.css";
import { Participante } from "@/schemas/types";

interface ParticipantesModalProps {
  participante: Participante;
  onParticipanteChange: (changes: Partial<Participante>) => void;
}

export function ParticipantesModal({
  participante,
  onParticipanteChange,
}: ParticipantesModalProps) {
  return (
    <>
      <div className={styles["form-group"]}>
        <label className={styles["form-label"]}>Nombre completo:</label>
        <input
          type="text"
          value={participante.nombre_completo}
          onChange={(e) =>
            onParticipanteChange({ nombre_completo: e.target.value })
          }
          className={styles["form-input"]}
          required
        />
      </div>

      <div className={styles["form-group"]}>
        <label className={styles["form-label"]}>Cargo:</label>
        <input
          type="text"
          value={participante.cargo}
          onChange={(e) =>
            onParticipanteChange({ cargo: e.target.value })
          }
          className={styles["form-input"]}
          required
        />
      </div>

      <div className={styles["form-group"]}>
        <label className={styles["form-label"]}>Departamento:</label>
        <input
          type="text"
          value={participante.departamento}
          onChange={(e) =>
            onParticipanteChange({ departamento: e.target.value })
          }
          className={styles["form-input"]}
          required
        />
      </div>

      <div className={styles["form-row"]}>
        <div className={styles["checkbox-group"]}>
          <label className={styles["checkbox-label"]}>
            <input
              type="checkbox"
              checked={participante.asistio_reunion_inicial}
              onChange={(e) =>
                onParticipanteChange({
                  asistio_reunion_inicial: e.target.checked,
                })
              }
              className={styles["checkbox"]}
            />
            Asistió a la reunión inicial
          </label>
        </div>

        <div className={styles["checkbox-group"]}>
          <label className={styles["checkbox-label"]}>
            <input
              type="checkbox"
              checked={participante.asistio_reunion_cierre}
              onChange={(e) =>
                onParticipanteChange({
                  asistio_reunion_cierre: e.target.checked,
                })
              }
              className={styles["checkbox"]}
            />
            Asistirá a la reunión de cierre
          </label>
        </div>
      </div>
    </>
  );
}

