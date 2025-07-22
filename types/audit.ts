export interface AuditCardType {
    id: number;
    client: {
        name: string;
        logo?: string;
    };
    standard: string;
    startDate: string;
    endDate: string;
    stage: string;
}

export interface Audit {
    id: string;
    client: {
        name: string;
        logo?: string;
    };
    standard: string;
    startDate: string;
    endDate: string;
    stage: string;
    location: string;
    scope: string;
    auditor: string;
    type: string;
}

export interface Hallazgo {
    id: number;
    auditoria_id: string;
    titulo: string;
    descripcion: string;
    clausula: string;
    type: "OB" | "NC" | "OM" | "PF";
    severidad: "menor" | "mayor" | "critica" | "";
    fecha_encontrado: string;
    fecha_resuelto?: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
}
