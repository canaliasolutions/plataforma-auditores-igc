import { Hallazgo } from "@/types/tipos";

/**
 * Campos que maneja el formulario + norma.
 * Evitamos los que genera el backend (id, fechas…).
 */
export type HallazgoDraft = Pick<
  Hallazgo,
  "evidencia" | "descripcion" | "clausula" | "tipo" | "severidad"
> & { norma: string };

export const hallazgoVacio: HallazgoDraft = {
  evidencia: "",
  descripcion: "",
  clausula: { value: "", label: "" },
  tipo: "OB",
  severidad: "",
  norma: "",
};

export const getSeverityColor = (s: string) =>
  ({ mayor: "#f39c12", menor: "#f1c40f" } as const)[s] ?? "#95a5a6";

export const getSeverityText = (s: string) =>
  ({ mayor: "Mayor", menor: "Menor" } as const)[s] ?? "Desconocida";

export const getTypeText = (t: string) =>
  (
    {
      OB: "Observación",
      NC: "No conformidad",
      OM: "Oportunidad de mejora",
      PF: "Punto fuerte",
    } as const
  )[t] ?? "Desconocido";
