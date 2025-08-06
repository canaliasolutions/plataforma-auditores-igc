import { useState, useCallback, useEffect } from "react";

/* -------- Formato que llega de la API (snake_case) -------- */
interface DbRow {
  id: number;
  auditoria_id: string;
  nombre_completo: string;
  cargo_rol: string;
  correo_electronico: string;
  asistio_reunion_inicial: number;
  asistio_reunion_cierre: number;
  fecha_agregado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

/* -------- Formato camelCase que usará toda la UI -------- */
export interface Participant {
  id: number;
  auditoriaId: string;
  nombreCompleto: string;
  cargoRol: string;
  correoElectronico: string;
  asistioReunionInicial: number;
  asistioReunionCierre: number;
  fechaAgregado: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export type CreatePayload = {
  auditoriaId: string;
  nombreCompleto: string;
  cargoRol: string;
  correoElectronico: string;
  asistioReunionInicial: boolean;
  asistioReunionCierre: boolean;
  fechaAgregado: string;
};

export type UpdatePayload = Partial<Omit<CreatePayload, "auditoriaId" | "fechaAgregado">>;

/* -------- conversión única -------- */
function mapRow(r: DbRow): Participant {
  return {
    id: r.id,
    auditoriaId: r.auditoria_id,
    nombreCompleto: r.nombre_completo,
    cargoRol: r.cargo_rol,
    correoElectronico: r.correo_electronico,
    asistioReunionInicial: r.asistio_reunion_inicial,
    asistioReunionCierre: r.asistio_reunion_cierre,
    fechaAgregado: r.fecha_agregado,
    fechaCreacion: r.fecha_creacion,
    fechaActualizacion: r.fecha_actualizacion,
  };
}

/* -------- hook principal -------- */
export function useParticipants(auditId: string) {
  const [list, setList] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/participantes?auditoriaId=${auditId}`);
      if (res.ok) {
        const rows: DbRow[] = await res.json();
        setList(rows.map(mapRow));
      }
    } finally {
      setLoading(false);
    }
  }, [auditId]);

  useEffect(() => { load(); }, [load]);

  const add = async (p: CreatePayload) => {
    const ok = (await fetch("/api/participantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    })).ok;
    if (ok) await load();
    return ok;
  };

  const update = async (id: number, p: UpdatePayload) => {
    const ok = (await fetch("/api/participantes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...p }),
    })).ok;
    if (ok) await load();
    return ok;
  };

  const remove = async (id: number) => {
    const ok = (await fetch("/api/participantes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })).ok;
    if (ok) await load();
    return ok;
  };

  return { list, loading, add, update, remove };
}
