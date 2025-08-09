import { z } from 'zod';

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

// Zod Schema for Hallazgo
export const HallazgoSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    proceso: z.string().nullable(),
    descripcion: z.string().nullable(),
    norma: z.string().nullable(),
    id_clausula: z.string().nullable(),
    label_clausula: z.string().nullable(),
    tipo: z.string().nullable(),
    severidad: z.string().nullable(),
    estado_abierto: z.boolean(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

// Zod Schema for Participante
export const ParticipanteSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    nombre_completo: z.string(),
    cargo: z.string(),
    departamento: z.string(),
    asistio_reunion_inicial: z.boolean(),
    asistio_reunion_cierre: z.boolean(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

// Zod Schema for VerificacionDatos
export const VerificacionDatosSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    nombre_organizacion_correcto: z.boolean(),
    nombre_organizacion: z.string().nullable(),
    RUC_correcto: z.boolean(),
    RUC: z.string().nullable(),
    persona_contacto_nombre: z.string().nullable(),
    persona_contacto_cargo: z.string().nullable(),
    persona_contacto_correo: z.string().nullable(),
    persona_firma_marca_nombre: z.string().nullable(),
    persona_firma_marca_cargo: z.string().nullable(),
    direccion_principal: z.string().nullable(),
    telefono: z.string().nullable(),
    centros_incluidos_alcance: z.string().nullable(),
    exclusiones_correctas: z.boolean(),
    exclusion_7152: z.boolean(),
    exclusion_83: z.boolean(),
    exclusion_851f: z.boolean(),
    exclusion_853: z.boolean(),
    exclusion_855: z.boolean(),
    numero_empleados_emplazamiento_json: z.object({ sitio: z.number() }).nullable(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

// Zod Schema for Conclusion
export const ConclusionSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    objetivos_auditoria_no_cumplidos: z.string().nullable(),
    sistema_no_cumple_norma: z.string().nullable(),
    auditor_jefe_recomienda_certificacion_inicial: z.boolean(),
    auditor_jefe_recomienda_mantenimiento: z.boolean(),
    auditor_jefe_recomienda_levantar_suspension: z.boolean(),
    auditor_jefe_recomienda_renovacion: z.boolean(),
    auditor_jefe_recomienda_ampliar_alcance: z.boolean(),
    auditor_jefe_recomienda_reduccion_alcance: z.boolean(),
    auditor_jefe_recomienda_restaurar_certificacion: z.boolean(),
    distancia_medio_fue_efectivo: z.boolean(),
    distancia_medio_utilizado_google_meets: z.boolean(),
    distancia_medio_utilizado_zoom: z.boolean(),
    distancia_medio_utilizado_teams: z.boolean(),
    distancia_medio_utilizado_otro: z.string().nullable(),
    distancia_inconveniente_interlocutor_no_disponible: z.boolean().nullable(),
    distancia_inconveniente_informacion_documentada_no_disponible: z.boolean().nullable(),
    distancia_inconveniente_confidencialidad_informacion: z.boolean().nullable(),
    distancia_inconveniente_observacion_actividades_tecnicas: z.boolean().nullable(),
    distancia_inconveniente_otro: z.string().nullable(),
    distancia_tecnica_video_conferencia: z.boolean().nullable(),
    distancia_tecnica_revision_asincrona: z.boolean().nullable(),
    distancia_tecnica_revision_sincrona: z.boolean().nullable(),
    distancia_tecnica_video_recorrido: z.boolean().nullable(),
    distancia_tecnica_video_procesos: z.boolean().nullable(),
    distancia_tecnica_plataformas_archivos: z.boolean().nullable(),
    distancia_tecnica_grabaciones: z.boolean().nullable(),
    distancia_tecnica_fotografias: z.boolean().nullable(),
    distancia_tecnica_otro: z.string().nullable(),
    presencial_tecnica_entrevistas: z.boolean().nullable(),
    presencial_tecnica_revision_registros: z.boolean().nullable(),
    presencial_tecnica_recorrido: z.boolean().nullable(),
    presencial_tecnica_observacion_procesos: z.boolean().nullable(),
    presencial_tecnica_observacion_actividades: z.boolean().nullable(),
    presencial_tecnica_otro: z.string().nullable(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

// Zod Schema for ValoracionSg
export const ValoracionSgSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    proyectos_construccion_ubicacion: z.string().nullable(),
    proyectos_instalacion_o_mantenimiento_auditado: z.string().nullable(),
    sitios_instalaciones_clientes: z.string().nullable(),
    sedes_auditdas: z.string().nullable(),
    productos_servicios_auditdos: z.string().nullable(),
    aspecto_ambiental_producido_emisiones: z.boolean().nullable(),
    aspecto_ambiental_producido_energia: z.boolean().nullable(),
    aspecto_ambiental_producido_vertidos: z.boolean().nullable(),
    aspecto_ambiental_producido_recursos_naturales: z.boolean().nullable(),
    aspecto_ambiental_producido_descargas_suelo: z.boolean().nullable(),
    aspecto_ambiental_producido_residuos: z.boolean().nullable(),
    aspecto_ambiental_producido_espacio_alteracion: z.boolean().nullable(),
    aspecto_ambiental_emergencia_incendio: z.boolean().nullable(),
    aspecto_ambiental_emergencia_inundacion: z.boolean().nullable(),
    aspecto_ambiental_emergencia_explosion: z.boolean().nullable(),
    aspecto_ambiental_emergencia_derrames: z.boolean().nullable(),
    aspecto_ambiental_emergencia_fugas: z.boolean().nullable(),
    aspecto_ambiental_emergencia_vertidos_incontrolados: z.boolean().nullable(),
    aspecto_ambiental_emergencia_otro: z.string().nullable(),
    turnos_auditados_7_16: z.boolean(),
    turnos_auditados_8_17: z.boolean(),
    turnos_auditados_9_18: z.boolean(),
    turnos_auditados_otro: z.string().nullable(),
    modalidad_auditoria: z.string().nullable(),
    declaracion_conformidad_sistema_gestion: z.string().nullable(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

// Zod Schema for AuditoriaInterna
export const AuditoriaInternaSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    periodicidad_auditoria_interna_anual: z.boolean(),
    periodicidad_auditoria_interna_semestral: z.boolean(),
    periodicidad_auditoria_interna_trimestral: z.boolean(),
    periodicidad_auditoria_interna_otra: z.string().nullable(),
    periodicidad_segun_procesos: z.string().nullable(),
    fecha_ultima_auditoria_interna: z.iso.date().nullable(),
    evidencias_incluyen_programa_auditorias: z.string().nullable(),
    evidencias_incluyen_plan_auditorias: z.string().nullable(),
    evidencias_incluyen_informe_auditoria: z.string().nullable(),
    evidencias_incluyen_listado_verificacion: z.string().nullable(),
    evidencias_incluyen_evaluacion_auditores: z.string().nullable(),
    auditoria_interna_no_conformidades: z.number().nullable(),
    auditoria_interna_observaciones: z.number().nullable(),
    auditoria_interna_oportunidades_mejora: z.number().nullable(),
    auditoria_interna_fortalezas: z.number().nullable(),
    planificaicon_oportuna_con_antelacion_explicacion: z.string().nullable(),
    independencia_objetividad_competencia_explicacion: z.string().nullable(),
    todos_requisitos_norma_alcance_auditados_explicacion: z.string().nullable(),
    consistencia_entre_interna_externa: z.string().nullable(),
    proceso_auditoria_interna_conforme: z.boolean(),
    nombre_consultor_empresa_implanto_sg: z.string().nullable(),
    auditoria_interna_por_personal_interno: z.boolean(),
    nombre_auditor_interno: z.string().nullable(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

// Zod Schema for RevisionSistema
export const RevisionSistemaSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    periodicidad_revision_anual: z.boolean(),
    periodicidad_revision_semestral: z.boolean(),
    periodicidad_revision_trimestral: z.boolean(),
    periodicidad_revision_otra: z.string().nullable(),
    fecha_ultima_revision: z.iso.datetime().nullable(),
    evidencias_incluyen_informe_revision: z.string().nullable(),
    evidencias_incluyen_acta_reunion: z.string().nullable(),
    evidencias_incluyen_resumen_ejecutivo: z.string().nullable(),
    evidencias_incluyen_presentacion: z.string().nullable(),
    evidencias_incluyen_otro: z.string().nullable(),
    proceso_revision_conforme: z.boolean(),
    periodicidad_requisitos_legales_anual: z.boolean().nullable(),
    periodicidad_requisitos_legales_semestral: z.boolean().nullable(),
    periodicidad_requisitos_legales_trimestral: z.boolean().nullable(),
    mecanismo_requisitos_legales_procedimiento_interno: z.boolean().nullable(),
    mecanismo_requisitos_legales_contrato: z.boolean().nullable(),
    mecanismo_requisitos_legales_sistema: z.boolean().nullable(),
    mecanismo_requisitos_legales_otro: z.boolean().nullable(),
    emprende_acciones_necesarias: z.boolean().nullable(),
    metodologia_requisitos_legales_conforme: z.string().nullable(),
    licencias_permisos_registros: z.string().nullable(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

// Zod Schema for Desviaciones
export const DesviacionesSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    cambio_responsable_sistema: z.string().nullable(),
    cambio_estructura_organizacion: z.string().nullable(),
    cambio_procesos: z.string().nullable(),
    cambio_turnos_o_modalidad: z.string().nullable(),
    otros_cambios: z.string().nullable(),
    cuestiones_afectan_programa_trienal: z.string().nullable(),
    asignar_mayor_tiempo_auditar_operaciones: z.string().nullable(),
    asignar_mayor_tiempo_auditar_recursos_apoyo: z.string().nullable(),
    asignar_mayor_tiempo_auditar_estrategicos: z.string().nullable(),
    asignar_mayor_tiempo_auditar_seguimiento_medicion: z.string().nullable(),
    asignar_mayor_tiempo_otros: z.string().nullable(),
    desviaciones_auditando_proceso: z.string().nullable(),
    desviaciones_auditando_proyecto: z.string().nullable(),
    desviaciones_auditando_instalacion: z.string().nullable(),
    desviaciones_auditando_sitio: z.string().nullable(),
    desviaciones_auditando_otro: z.string().nullable(),
    motivo_desviacion_interlocutor_no_disponible: z.boolean().nullable(),
    motivo_desviacion_documentacion_no_disponible: z.boolean().nullable(),
    motivo_desviacion_problemas_conexion: z.boolean().nullable(),
    motivo_desviacion_problemas_logisticos: z.boolean().nullable(),
    motivo_desviacion_incidentes_trabajo: z.boolean().nullable(),
    motivo_desviacion_cambio_agenda: z.boolean().nullable(),
    motivo_desviacion_otro: z.string().nullable(),
    tiempo_faltante: z.string().nullable(),
    proxima_auditoria_evidenciar_insitu: z.boolean(),
    proxima_auditoria_9001_produccion_prestacion_servicio: z.boolean().nullable(),
    proxima_auditoria_9001_programar_visita_sitio: z.boolean().nullable(),
    proxima_auditoria_9001_preservacion: z.boolean().nullable(),
    proxima_auditoria_9001_trazabilidad: z.boolean().nullable(),
    proxima_auditoria_9001_ambiente_procesos: z.boolean().nullable(),
    proxima_auditoria_9001_infraestructura: z.boolean().nullable(),
    proxima_auditoria_9001_otro: z.boolean().nullable(),
    proxima_auditoria_14001_control_operacional: z.boolean().nullable(),
    proxima_auditoria_14001_programar_visita_sitio: z.boolean().nullable(),
    proxima_auditoria_14001_aspectos_ambientales: z.boolean().nullable(),
    proxima_auditoria_14001_recursos: z.boolean().nullable(),
    proxima_auditoria_14001_otro: z.boolean().nullable(),
    diferencias_opinion: z.string().nullable(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

// Zod Schema for ActividadesIntegradas
export const ActividadesIntegradasSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    unica_revision_todos_requerimientos: z.boolean(),
    auditorias_internas_integradas: z.boolean(),
    politica_unica_sistema_integrado: z.boolean(),
    gestion_ambiental_integrada: z.boolean(),
    mapa_procesos_integrados: z.boolean(),
    identificacion_contexto_considera_ambiente_calidad: z.boolean(),
    unica_sistematica_riesgos_oportunidades: z.boolean(),
    informacion_documentada_unica_requisitos_comunes: z.boolean(),
    acciones_de_mejora_integradas: z.boolean(),
    planificacion_objetivos_indicadores_integrados: z.boolean(),
    actividades_responsabilidades_integradas: z.boolean(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

// Zod Schema for UsoDeMarca
export const UsoDeMarcaSchema = z.object({
    id: z.number().optional(),
    id_auditoria: z.string(),
    uso_marca: z.boolean(),
    uso_marca_adecuado: z.boolean().nullable(),
    sitio_uso_marca_pagina_web: z.boolean().nullable(),
    sitio_uso_marca_hojas: z.boolean().nullable(),
    sitio_uso_marca_vehiculos: z.boolean().nullable(),
    sitio_uso_marca_tarjetas: z.boolean().nullable(),
    sitio_uso_marca_documento: z.boolean().nullable(),
    sitio_uso_marca_redes_sociales: z.boolean().nullable(),
    sitio_uso_marca_correo_electronico: z.boolean().nullable(),
    sitio_uso_marca_otro: z.string().nullable(),
    fecha_creacion: z.iso.datetime().nullable(),
    fecha_actualizacion: z.iso.datetime().nullable(),
});

export type Hallazgo = z.infer<typeof HallazgoSchema>;
export type Participante = z.infer<typeof ParticipanteSchema>;
export type VerificacionDatos = z.infer<typeof VerificacionDatosSchema>;
export type Conclusion = z.infer<typeof ConclusionSchema>;
export type ValoracionSg = z.infer<typeof ValoracionSgSchema>;
export type AuditoriaInterna = z.infer<typeof AuditoriaInternaSchema>;
export type RevisionSistema = z.infer<typeof RevisionSistemaSchema>;
export type Desviaciones = z.infer<typeof DesviacionesSchema>;
export type ActividadesIntegradas = z.infer<typeof ActividadesIntegradasSchema>;
export type UsoDeMarca = z.infer<typeof UsoDeMarcaSchema>;
