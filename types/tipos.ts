export type ResumenAuditoria = Omit<Auditoria, "alcance" | "ubicacion" | "nombreAuditor" | "correoAuditor" | "tipo">

export type Auditoria = {
    id: string;
    cliente: {
        nombre: string;
        logo?: string;
    };
    norma: string;
    fechaInicio: string;
    fechaFinal: string;
    etapa: string;
    ubicacion: string;
    alcance: string;
    nombreAuditor: string;
    correoAuditor: string;
    tipo: string;
}

export type Hallazgo = {
    id: number;
    auditoria_id: string;
    evidencia: string;
    descripcion: string;
    clausula: {value: string, label: string};
    tipo: "OB" | "NC" | "OM" | "PF";
    norma: string;
    severidad: "menor" | "mayor" | "";
    fecha_encontrado: string;
    fecha_resuelto?: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
}

export type Informe = {

}