"use client";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Hallazgos.module.css";
import { Auditoria, Hallazgo } from "@/types/tipos";
import { apartados } from "@/constants/apartados";
import { hallazgoVacio, HallazgoDraft } from "./helpers";

interface Props {
  open: boolean;
  auditoria: Auditoria;
  initialItem: Hallazgo | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function HallazgoModal({
  open,
  auditoria,
  initialItem,
  onClose,
  onSaved,
}: Props) {

  const isEdit = Boolean(initialItem);

  const initialDraft: HallazgoDraft = isEdit
    ? {
        evidencia: initialItem!.evidencia,
        descripcion: initialItem!.descripcion,
        clausula: initialItem!.clausula,
        tipo: initialItem!.tipo,
        severidad: initialItem!.severidad ?? "",
        norma: auditoria.norma,
      }
    : { ...hallazgoVacio, norma: auditoria.norma };

  const [data, setData] = useState<HallazgoDraft>(initialDraft);
  
  if (!open) return null;

  const handleChange =
    (field: keyof HallazgoDraft) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      if (field === "clausula") {
        setData({
          ...data,
          clausula: {
            value: e.target.value,
            label: (e.target as HTMLSelectElement).selectedOptions[0].text,
          },
        });
        return;
      }
      setData({ ...data, [field]: e.target.value } as HallazgoDraft);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEdit ? "PUT" : "POST";
    const url = "/api/hallazgos";

    const body = isEdit
      ? {
          id: initialItem!.id,
          evidencia: data.evidencia,
          descripcion: data.descripcion,
          clausula: data.clausula,
          tipo: data.tipo,
          norma: auditoria.norma,
          severidad: data.tipo === "NC" ? data.severidad : null,
          fechaResuelto: initialItem!.fecha_resuelto,
        }
      : {
          auditoriaId: auditoria.id,
          evidencia: data.evidencia,
          descripcion: data.descripcion,
          clausula: data.clausula,
          tipo: data.tipo,
          norma: auditoria.norma,
          severidad: data.tipo === "NC" ? data.severidad : null,
          fechaEncontrado: new Date().toISOString().split("T")[0],
        };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        onSaved();
        onClose();
      } else {
        console.error("Error saving hallazgo");
      }
    } catch (err) {
      console.error("Error saving hallazgo:", err);
    }
  };

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <div className={styles["modal-header"]}>
          <h3 className={styles["modal-title"]}>
            {isEdit ? "Editar hallazgo" : "Nuevo hallazgo"}
          </h3>
          <button onClick={onClose} className={styles["close-button"]}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* ---------- FORMULARIO ---------- */}
        <form onSubmit={handleSubmit} className={styles["add-form"]}>
          <div className={styles["modal-body"]}>
            {/* Evidencia */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Evidencia:</label>
              <input
                type="text"
                value={data.evidencia}
                onChange={handleChange("evidencia")}
                className={styles["form-input"]}
              />
            </div>
            {/* Descripción */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Descripción:</label>
              <textarea
                value={data.descripcion}
                onChange={handleChange("descripcion")}
                className={styles["form-textarea"]}
                rows={4}
                required
              />
            </div>
            {/* Fila: tipo, cláusula, severidad */}
            <div className={styles["form-row"]}>
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Tipo:</label>
                <select
                  value={data.tipo}
                  onChange={handleChange("tipo")}
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
                  value={data.clausula.value}
                  onChange={handleChange("clausula")}
                  className={styles["form-select"]}
                  disabled={data.tipo !== "NC"}
                  required={data.tipo === "NC"}
                >
                  {apartados.map((a) => (
                    <option key={a.id} value={String(a.id)}>
                      {a.clausula}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Severidad:</label>
                <select
                  value={data.severidad}
                  onChange={handleChange("severidad")}
                  className={styles["form-select"]}
                  disabled={data.tipo !== "NC"}
                  required={data.tipo === "NC"}
                >
                  <option value=""></option>
                  <option value="menor">Menor</option>
                  <option value="mayor">Mayor</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles["form-actions"]}>
            <button type="button" onClick={onClose} className={styles["cancel-button"]}>
              Cancelar
            </button>
            <button type="submit" className={styles["submit-button"]}>
              {isEdit ? "Actualizar hallazgo" : "Agregar hallazgo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
