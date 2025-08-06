"use client";
import { useState } from "react";
import { flushSync } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Hallazgos.module.css";
import { Auditoria, Hallazgo } from "@/types/tipos";
import { apartados } from "@/constants/apartados";
import { hallazgoVacio, HallazgoDraft } from "./helpers";
import SelectWrapper from "@/components/SelectWrapper";
import Tooltip from "@/components/Tooltip";

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
  const [warnClausula, setWarnClausula] = useState(false);
  const [warnSeveridad, setWarnSeveridad] = useState(false);
  const [warnDescripcion, setWarnDescripcion] = useState(false);
  const [warnEvidencia, setWarnEvidencia] = useState(false);

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
    <K extends keyof HallazgoDraft>(field: K) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const raw = e.target;

        setData((prev) => {
          if (field === "tipo") {
            return {
              ...prev,
              tipo: raw.value as HallazgoDraft["tipo"],
              clausula: { value: "", label: "" },
              severidad: "" as HallazgoDraft["severidad"],
            };
          }
          if (field === "clausula") {
            const sel = raw as HTMLSelectElement;
            return {
              ...prev,
              clausula: {
                value: sel.value,
                label: sel.selectedOptions[0]?.text ?? "",
              },
            };
          }

          return { ...prev, [field]: raw.value } as HallazgoDraft;
        });
      };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const faltaClausula = data.tipo === "NC" && data.clausula.value === "";
    const faltaSeveridad = data.tipo === "NC" && data.severidad === "";
    const faltaDescripcion = data.descripcion.trim() === "";
    const faltaEvidencia = data.evidencia.trim() === "";

    flushSync(() => {
      setWarnClausula(false);
      setWarnSeveridad(false);
      setWarnDescripcion(false);
      setWarnEvidencia(false);
    });

    if (faltaClausula || faltaSeveridad || faltaDescripcion || faltaEvidencia) {
      setWarnClausula(faltaClausula);
      setWarnSeveridad(faltaSeveridad);
      setWarnDescripcion(faltaDescripcion);
      setWarnEvidencia(faltaEvidencia);
      return;               // ⬅️ impide el envío
    }


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
        <form onSubmit={handleSubmit} className={styles["add-form"]} noValidate>
          <div className={styles["modal-body"]}>
            {/* Evidencia */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Evidencia:</label>
              <Tooltip
                content="La evidencia no puede estar vacía"
                variant="danger"
                trigger="manual"
                open={warnEvidencia}
                autoClose={2000}
                onHide={() => setWarnEvidencia(false)}
                placement="bottom"
              >
                <input
                  type="text"
                  value={data.evidencia}
                  onChange={handleChange("evidencia")}
                  className={styles["form-input"]}
                  required
                />
              </Tooltip>
            </div>
            {/* Descripción */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Descripción:</label>
              <Tooltip
                content="La descripción no puede estar vacía"
                variant="danger"
                trigger="manual"
                open={warnDescripcion}
                autoClose={2000}
                placement = "bottom"
                onHide={() => setWarnDescripcion(false)}
              >
                <textarea
                  value={data.descripcion}
                  onChange={handleChange("descripcion")}
                  className={styles["form-textarea"]}
                  rows={4}
                  required
                />

              </Tooltip>

            </div>
            {/* Fila: tipo, cláusula, severidad */}
            <div className={styles["form-row"]}>
              {/* ------------ Tipo ------------ */}
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Tipo:</label>
                {/* ——— Tipo ——— */}
                <SelectWrapper
                  name="tipo"               // ← solo si lo envías en un <form>
                  required                  // ← validación HTML5 de “campo obligatorio”
                  value={data.tipo}
                  onChange={(v) =>
                    setData((prev) => ({
                      ...prev,
                      tipo: v as HallazgoDraft["tipo"],
                      clausula: { value: "", label: "" },
                      severidad: "" as HallazgoDraft["severidad"],
                    }))
                  }
                >
                  <option value="OB">Observación</option>
                  <option value="NC">No conformidad</option>
                  <option value="OM">Oportunidad de mejora</option>
                  <option value="PF">Punto fuerte</option>
                </SelectWrapper>


              </div>
              {/* ------------ Cláusula ------------ */}
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Cláusula:</label>

                <Tooltip
                  content="Selecciona una cláusula"
                  variant="danger"
                  trigger="manual"
                  open={warnClausula}
                  autoClose={2000}
                  onHide={() => setWarnClausula(false)}
                  placement="bottom"
                >
                  <SelectWrapper
                    name="clausula"
                    value={data.clausula.value}
                    onChange={(v) =>
                      setData((prev) => ({
                        ...prev,
                        clausula: {
                          value: v,
                          label: apartados.find((a) => String(a.id) === v)?.clausula ?? "",
                        },
                      }))
                    }
                    disabled={data.tipo !== "NC"}
                    required={data.tipo === "NC"}
                    wrapperClassName={data.tipo !== "NC" ? styles["is-disabled"] : ""}
                  >
                    {apartados.map((a) => (
                      <option key={a.id} value={String(a.id)}>
                        {a.clausula}
                      </option>
                    ))}
                  </SelectWrapper>
                </Tooltip>


              </div>

              {/* ------------ Severidad ------------ */}
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Severidad:</label>

                <Tooltip
                  content="Selecciona severidad"
                  variant="danger"
                  trigger="manual"
                  open={warnSeveridad}
                  autoClose={2000}
                  placement="bottom"
                  onHide={() => setWarnSeveridad(false)}
                >
                  <SelectWrapper
                    name="severidad"
                    value={data.severidad}
                    onChange={(v) =>
                      setData((prev) => ({
                        ...prev,
                        severidad: v as HallazgoDraft["severidad"],
                      }))
                    }
                    disabled={data.tipo !== "NC"}
                    required={data.tipo === "NC"}
                    wrapperClassName={data.tipo !== "NC" ? styles["is-disabled"] : ""}
                  >
                    <option value=""></option>
                    <option value="menor">Menor</option>
                    <option value="mayor">Mayor</option>
                  </SelectWrapper>
                </Tooltip>


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
