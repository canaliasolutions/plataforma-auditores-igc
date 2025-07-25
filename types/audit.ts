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
    evidencia: string;
    descripcion: string;
    clausula: {value: string, label: string};
    type: "OB" | "NC" | "OM" | "PF";
    severidad: "menor" | "mayor" | "";
    fecha_encontrado: string;
    fecha_resuelto?: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
}

export interface Informe {

}