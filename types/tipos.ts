export type ResumenAuditoria = Omit<Auditoria, "alcance" | "ubicacion" | "nombreAuditor" | "correoAuditor" | "tipo">

export type Auditoria = {
    id: string;
    nombre_cliente: string;
    logo_cliente?: string;
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
    id_auditoria: string;
    evidencia: string;
    descripcion?: string;
    norma: string;
    id_clausula?: string;
    label_clausula?: string;
    tipo: string;
    severidad?: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}

export type Participante = {
    id: number;
    id_auditoria: string;
    nombre_completo: string;
    cargo_rol: string;
    correo_electronico: string;
    asistio_reunion_inicial: boolean;
    asistio_reunion_cierre: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}

export type VerificacionDatos = {
    id: number;
    id_auditoria: string;
    datos_contacto: string;
    datos_alcance: string;
    datos_facturacion: string;
    comentarios_verificacion?: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}

export type Eficacia = {
    id: number;
    id_auditoria: string;
    tipo_auditoria: string;
    medio_utilizado?: string;
    otro_medio?: string;
    medio_efectivo?: string;
    inconvenientes_presentados?: string;
    tipos_inconvenientes?: string;
    otros_inconvenientes?: string;
    tecnicas_utilizadas?: string;
    tecnicas_insitu_utilizadas?: string;
    otras_tecnicas?: string;
    otras_tecnicas_insitu?: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}

export type Conclusion = {
    id: number;
    id_auditoria: string;
    objetivos_cumplidos: string;
    desviacion_plan?: string;
    sistema_cumple_norma: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}

export type Objeto = { [key: string]: string };