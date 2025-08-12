
export async function up(pool) {
    await pool.query(`
  CREATE TABLE IF NOT EXISTS informe_hallazgos (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL,
    proceso TEXT NOT NULL,
    descripcion TEXT,
    norma TEXT NOT NULL,
    id_clausula TEXT,
    label_clausula TEXT,
    tipo TEXT NOT NULL,
    severidad TEXT,
    estado_abierto BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS informe_participantes (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    cargo TEXT NOT NULL,
    departamento TEXT NOT NULL,
    asistio_reunion_inicial BOOLEAN NOT NULL,
    asistio_reunion_cierre BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS informe_verificacion_datos (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    nombre_organizacion TEXT,
    ruc TEXT,
    persona_contacto_nombre TEXT,
    persona_contacto_cargo TEXT,
    persona_contacto_correo TEXT,
    persona_firma_marca_nombre TEXT,
    persona_firma_marca_cargo TEXT,
    direccion_principal TEXT,
    telefono TEXT,
    centros_incluidos_alcance TEXT,
    exclusion_7152 BOOLEAN,
    exclusion_83 BOOLEAN,
    exclusion_851f BOOLEAN,
    exclusion_853 BOOLEAN,
    exclusion_855 BOOLEAN,
    numero_empleados_emplazamiento_json JSONB DEFAULT '{}'::jsonb,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS informe_conclusiones (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    objetivos_auditoria_no_cumplidos TEXT,
    sistema_no_cumple_norma TEXT,
    auditor_jefe_recomienda_certificacion_inicial BOOLEAN NOT NULL,
    auditor_jefe_recomienda_mantenimiento BOOLEAN NOT NULL,
    auditor_jefe_recomienda_levantar_suspension BOOLEAN NOT NULL,
    auditor_jefe_recomienda_renovacion BOOLEAN NOT NULL,
    auditor_jefe_recomienda_ampliar_alcance BOOLEAN NOT NULL,
    auditor_jefe_recomienda_reduccion_alcance BOOLEAN NOT NULL,
    auditor_jefe_recomienda_restaurar_certificacion BOOLEAN NOT NULL,
    distancia_medio_fue_efectivo BOOLEAN NOT NULL,
    distancia_medio_utilizado_google_meets BOOLEAN NOT NULL,
    distancia_medio_utilizado_zoom BOOLEAN NOT NULL,
    distancia_medio_utilizado_teams BOOLEAN NOT NULL,
    distancia_medio_utilizado_otro TEXT,
    distancia_inconveniente_interlocutor_no_disponible BOOLEAN,
    distancia_inconveniente_informacion_documentada_no_disponible BOOLEAN,
    distancia_inconveniente_confidencialidad_informacion BOOLEAN,
    distancia_inconveniente_observacion_actividades_tecnicas BOOLEAN,
    distancia_inconveniente_otro TEXT,
    distancia_tecnica_video_conferencia BOOLEAN,
    distancia_tecnica_revision_asincrona BOOLEAN,
    distancia_tecnica_revision_sincrona BOOLEAN,
    distancia_tecnica_video_recorrido BOOLEAN,
    distancia_tecnica_video_procesos BOOLEAN,
    distancia_tecnica_plataformas_archivos BOOLEAN,
    distancia_tecnica_grabaciones BOOLEAN,
    distancia_tecnica_fotografias BOOLEAN,
    distancia_tecnica_otro TEXT,
    presencial_tecnica_entrevistas BOOLEAN,
    presencial_tecnica_revision_registros BOOLEAN,
    presencial_tecnica_recorrido BOOLEAN,
    presencial_tecnica_observacion_procesos BOOLEAN,
    presencial_tecnica_observacion_actividades BOOLEAN,
    presencial_tecnica_otro TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS informe_valoracion_sg (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    proyectos_construccion_ubicacion TEXT,
    proyectos_instalacion_o_mantenimiento_auditado TEXT,
    sitios_instalaciones_clientes TEXT,
    sedes_auditdas TEXT,
    productos_servicios_auditdos TEXT,
    aspecto_ambiental_producido_emisiones BOOLEAN,
    aspecto_ambiental_producido_energia BOOLEAN,
    aspecto_ambiental_producido_vertidos BOOLEAN,
    aspecto_ambiental_producido_recursos_naturales BOOLEAN,
    aspecto_ambiental_producido_descargas_suelo BOOLEAN,
    aspecto_ambiental_producido_residuos BOOLEAN,
    aspecto_ambiental_producido_espacio_alteracion BOOLEAN,
    aspecto_ambiental_emergencia_incendio BOOLEAN,
    aspecto_ambiental_emergencia_inundacion BOOLEAN,
    aspecto_ambiental_emergencia_explosion BOOLEAN,
    aspecto_ambiental_emergencia_derrames BOOLEAN,
    aspecto_ambiental_emergencia_fugas BOOLEAN,
    aspecto_ambiental_emergencia_vertidos_incontrolados BOOLEAN,
    aspecto_ambiental_emergencia_otro TEXT,
    turnos_auditados_7_16 BOOLEAN NOT NULL,
    turnos_auditados_8_17 BOOLEAN NOT NULL,
    turnos_auditados_9_18 BOOLEAN NOT NULL,
    turnos_auditados_otro TEXT,
    modalidad_auditoria TEXT,
    declaracion_conformidad_sistema_gestion TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS informe_auditorias_internas (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    periodicidad_auditoria_interna_anual BOOLEAN NOT NULL,
    periodicidad_auditoria_interna_semestral BOOLEAN NOT NULL,
    periodicidad_auditoria_interna_trimestral BOOLEAN NOT NULL,
    periodicidad_auditoria_interna_otra TEXT,
    periodicidad_segun_procesos TEXT,
    fecha_ultima_auditoria_interna DATE,
    evidencias_incluyen_programa_auditorias TEXT,
    evidencias_incluyen_plan_auditorias TEXT,
    evidencias_incluyen_informe_auditoria TEXT,
    evidencias_incluyen_listado_verificacion TEXT,
    evidencias_incluyen_evaluacion_auditores TEXT,
    auditoria_interna_no_conformidades INTEGER,
    auditoria_interna_observaciones INTEGER,
    auditoria_interna_oportunidades_mejora INTEGER,
    auditoria_interna_fortalezas INTEGER,
    planificaicon_oportuna_con_antelacion_explicacion TEXT,
    independencia_objetividad_competencia_explicacion TEXT,
    todos_requisitos_norma_alcance_auditados_explicacion TEXT,
    consistencia_entre_interna_externa TEXT,
    proceso_auditoria_interna_conforme BOOLEAN NOT NULL,
    nombre_consultor_empresa_implanto_sg TEXT,
    auditoria_interna_por_personal_interno BOOLEAN NOT NULL,
    nombre_auditor_interno TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS informe_revision_sistema (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    periodicidad_revision_anual BOOLEAN NOT NULL,
    periodicidad_revision_semestral BOOLEAN NOT NULL,
    periodicidad_revision_trimestral BOOLEAN NOT NULL,
    periodicidad_revision_otra TEXT,
    fecha_ultima_revision DATE,
    evidencias_incluyen_informe_revision TEXT,
    evidencias_incluyen_acta_reunion TEXT,
    evidencias_incluyen_resumen_ejecutivo TEXT,
    evidencias_incluyen_presentacion TEXT,
    evidencias_incluyen_otro TEXT,
    proceso_revision_conforme BOOLEAN NOT NULL,
    periodicidad_requisitos_legales_anual BOOLEAN,
    periodicidad_requisitos_legales_semestral BOOLEAN,
    periodicidad_requisitos_legales_trimestral BOOLEAN,
    mecanismo_requisitos_legales_procedimiento_interno BOOLEAN,
    mecanismo_requisitos_legales_contrato BOOLEAN,
    mecanismo_requisitos_legales_sistema BOOLEAN,
    mecanismo_requisitos_legales_otro BOOLEAN,
    emprende_acciones_necesarias BOOLEAN,
    metodologia_requisitos_legales_conforme TEXT,
    licencias_permisos_registros TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS informe_desviaciones (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    cambio_responsable_sistema TEXT,
    cambio_estructura_organizacion TEXT,
    cambio_procesos TEXT,
    cambio_turnos_o_modalidad TEXT,
    otros_cambios TEXT,
    cuestiones_afectan_programa_trienal TEXT,
    asignar_mayor_tiempo_auditar_operaciones TEXT,
    asignar_mayor_tiempo_auditar_recursos_apoyo TEXT,
    asignar_mayor_tiempo_auditar_estrategicos TEXT,
    asignar_mayor_tiempo_auditar_seguimiento_medicion TEXT,
    asignar_mayor_tiempo_otros TEXT,
    desviaciones_auditando_proceso TEXT,
    desviaciones_auditando_proyecto TEXT,
    desviaciones_auditando_instalacion TEXT,
    desviaciones_auditando_sitio TEXT,
    desviaciones_auditando_otro TEXT,
    motivo_desviacion_interlocutor_no_disponible BOOLEAN,
    motivo_desviacion_documentacion_no_disponible BOOLEAN,
    motivo_desviacion_problemas_conexion BOOLEAN,
    motivo_desviacion_problemas_logisticos BOOLEAN,
    motivo_desviacion_incidentes_trabajo BOOLEAN,
    motivo_desviacion_cambio_agenda BOOLEAN,
    motivo_desviacion_otro TEXT,
    tiempo_faltante TEXT,
    proxima_auditoria_evidenciar_insitu BOOLEAN NOT NULL,
    proxima_auditoria_9001_produccion_prestacion_servicio BOOLEAN,
    proxima_auditoria_9001_programar_visita_sitio BOOLEAN,
    proxima_auditoria_9001_preservacion BOOLEAN,
    proxima_auditoria_9001_trazabilidad BOOLEAN,
    proxima_auditoria_9001_ambiente_procesos BOOLEAN,
    proxima_auditoria_9001_infraestructura BOOLEAN,
    proxima_auditoria_9001_otro BOOLEAN,
    proxima_auditoria_14001_control_operacional BOOLEAN,
    proxima_auditoria_14001_programar_visita_sitio BOOLEAN,
    proxima_auditoria_14001_aspectos_ambientales BOOLEAN,
    proxima_auditoria_14001_recursos BOOLEAN,
    proxima_auditoria_14001_otro BOOLEAN,
    diferencias_opinion TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS informe_actividades_integadas (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    unica_revision_todos_requerimientos BOOLEAN NOT NULL,
    auditorias_internas_integradas BOOLEAN NOT NULL,
    politica_unica_sistema_integrado BOOLEAN NOT NULL,
    gestion_ambiental_integrada BOOLEAN NOT NULL,
    mapa_procesos_integrados BOOLEAN NOT NULL,
    identificacion_contexto_considera_ambiente_calidad BOOLEAN NOT NULL,
    unica_sistematica_riesgos_oportunidades BOOLEAN NOT NULL,
    informacion_documentada_unica_requisitos_comunes BOOLEAN NOT NULL,
    acciones_de_mejora_integradas BOOLEAN NOT NULL,
    planificacion_objetivos_indicadores_integrados BOOLEAN NOT NULL,
    actividades_responsabilidades_integradas BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS informe_uso_de_marca (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    uso_marca BOOLEAN NOT NULL,
    uso_marca_adecuado BOOLEAN,
    sitio_uso_marca_pagina_web BOOLEAN,
    sitio_uso_marca_hojas BOOLEAN,
    sitio_uso_marca_vehiculos BOOLEAN,
    sitio_uso_marca_tarjetas BOOLEAN,
    sitio_uso_marca_documento BOOLEAN,
    sitio_uso_marca_redes_sociales BOOLEAN,
    sitio_uso_marca_correo_electronico BOOLEAN,
    sitio_uso_marca_otro TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `);
}

export async function down(pool) {
    await pool.query(`
        DROP TABLE IF EXISTS informe_hallazgos;
        DROP TABLE IF NOT EXISTS informe_participantes;
        DROP TABLE IF NOT EXISTS informe_verificacion_datos;
        DROP TABLE IF NOT EXISTS informe_conclusiones;
        DROP TABLE IF NOT EXISTS informe_valoracion_sg;
        DROP TABLE IF NOT EXISTS informe_auditorias_internas;
        DROP TABLE IF NOT EXISTS informe_revision_sistema;
        DROP TABLE IF NOT EXISTS informe_desviaciones;
        DROP TABLE IF NOT EXISTS informe_actividades_integadas;
        DROP TABLE IF NOT EXISTS informe_uso_de_marca;
`);
}