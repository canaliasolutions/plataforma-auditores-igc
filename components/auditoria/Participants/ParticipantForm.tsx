import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Tooltip from "@/components/Tooltip";
import styles from "./Participants.module.css";
import { CreatePayload, Participant } from "@/hooks/useParticipants";

interface Props {
  auditId: string;
  open: boolean;
  initial: Participant | null;
  onCancel: () => void;
  onSubmit: (p: CreatePayload | Partial<CreatePayload>) => void;
}

/* ---------- util ---------- */
function initFrom(src: Participant | null) {
  return {
    nombreCompleto: src?.nombreCompleto ?? "",
    cargoRol: src?.cargoRol ?? "",
    correoElectronico: src?.correoElectronico ?? "",
    asistioReunionInicial: !!src?.asistioReunionInicial,
    asistioReunionCierre: !!src?.asistioReunionCierre,
  };
}

export default function ParticipantForm({
  auditId, open, initial, onCancel, onSubmit,
}: Props) {

  /* ---------- estado ---------- */
  const [form, setForm] = useState(() => initFrom(initial));

  const [warnNombre, setWarnNombre] = useState(false);
  const [warnCargo, setWarnCargo] = useState(false);
  const [warnCorreo, setWarnCorreo] = useState(false);
  const [warnReuniones, setWarnReuniones] = useState(false);

  /* sincroniza al cambiar `initial` */
  useEffect(() => { setForm(initFrom(initial)); }, [initial]);

  if (!open) return null;

  /* ---------- handlers ---------- */
  const onChange =
    <K extends keyof typeof form>(k: K) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [k]: e.target.value });
        if (k === "nombreCompleto" && warnNombre) setWarnNombre(false);
        else if (k === "cargoRol" && warnCargo) setWarnCargo(false);
        else if (k === "correoElectronico" && warnCorreo) setWarnCorreo(false);
      };

  const save = (e: React.FormEvent) => {
    e.preventDefault();

    flushSync(() => {
      setWarnNombre(false);
      setWarnCargo(false);
      setWarnCorreo(false);
      setWarnReuniones(false);
    });

    const faltaNombre = !form.nombreCompleto.trim();
    const faltaCargo = !form.cargoRol.trim();
    const faltaCorreo = !form.correoElectronico.trim();
    const faltaReunion = !form.asistioReunionInicial && !form.asistioReunionCierre;

    setWarnNombre(faltaNombre);
    setWarnCargo(faltaCargo);
    setWarnCorreo(faltaCorreo);
    setWarnReuniones(faltaReunion);

    if (faltaNombre || faltaCargo || faltaCorreo || faltaReunion) return;

    onSubmit({
      auditoriaId: auditId,
      ...form,
      fechaAgregado: new Date().toISOString().split("T")[0],
    });
  };

  /* ---------- render ---------- */
  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <div className={styles["modal-header"]}>
          <h3 className={styles["modal-title"]}>
            {initial ? "Editar" : "Nuevo"} participante
          </h3>
          <button onClick={onCancel} className={styles["close-button"]}>✕</button>
        </div>

        <form onSubmit={save} className={styles["add-form"]}>
          <div className={styles["modal-body"]}>
            {/* ------ Nombre ------ */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Nombre completo:</label>
              <Tooltip
                content="El nombre completo es obligatorio"
                variant="danger"
                trigger="manual"
                open={warnNombre}
                autoClose={2000}
                placement="bottom"
                onHide={() => setWarnNombre(false)}
              >
                <input
                  type="text"
                  value={form.nombreCompleto}
                  onChange={onChange("nombreCompleto")}
                  className={styles["form-input"]}
                />
              </Tooltip>
            </div>

            {/* ------ Cargo / Rol ------ */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Cargo / Rol:</label>
              <Tooltip
                content="El cargo o rol es obligatorio"
                variant="danger"
                trigger="manual"
                open={warnCargo}
                autoClose={2000}
                placement="bottom"
                onHide={() => setWarnCargo(false)}
              >
                <input
                  type="text"
                  value={form.cargoRol}
                  onChange={onChange("cargoRol")}
                  className={styles["form-input"]}
                />
              </Tooltip>
            </div>

            {/* ------ Correo electrónico ------ */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Correo electrónico:</label>
              <Tooltip
                content="El correo electrónico es obligatorio"
                variant="danger"
                trigger="manual"
                open={warnCorreo}
                autoClose={2000}
                placement="bottom"
                onHide={() => setWarnCorreo(false)}
              >
                <input
                  type="email"
                  value={form.correoElectronico}
                  onChange={onChange("correoElectronico")}
                  className={styles["form-input"]}
                />
              </Tooltip>
            </div>

            {/* ------ Checkboxes ------ */}
            <Tooltip
              content="Marca al menos una reunión"
              variant="danger"
              trigger="manual"
              open={warnReuniones}
              autoClose={2000}
              placement="bottom"
              onHide={() => setWarnReuniones(false)}
            >
              <div className={styles["form-row"]}>
                {(["asistioReunionInicial", "asistioReunionCierre"] as const).map(k => (
                  <label key={k} className={styles["checkbox-label"]}>
                    <input
                      type="checkbox"
                      checked={form[k]}
                      onChange={e => {
                        setForm({ ...form, [k]: e.target.checked });
                        // si marca al menos una, quita el aviso
                        if (e.target.checked) setWarnReuniones(false);
                      }}
                      className={styles["checkbox"]}
                    />{" "}
                    {k === "asistioReunionInicial" ? "Reunión inicial" : "Reunión de cierre"}
                  </label>
                ))}
              </div>
            </Tooltip>
          </div>
          {/* ------ Botones ------ */}
          <div className={styles["form-actions"]}>
            <button type="button" onClick={onCancel} className={styles["cancel-button"]}>
              Cancelar
            </button>
            <button type="submit" className={styles["submit-button"]}>
              {initial ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
