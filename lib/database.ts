import {Pool, QueryResult, QueryResultRow} from 'pg';
import {Hallazgo, Conclusion, Participante, Eficacia, VerificacionDatos} from "@/types/tipos";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function query<T extends QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
  console.info('Ejecutando consulta:', text, params);
  try {
    return pool.query<T>(text, params);
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    throw error;
  }
}

type OmittedColumns = 'id' | 'fecha_creacion' | 'fecha_actualizacion';
type InsertData<T> = Omit<T, OmittedColumns>;
type UpdateData<T> = Omit<T, OmittedColumns | 'id_auditoria'>;

type ColumnNames<T> = ReadonlyArray<keyof T>;

const hallazgosInsertColumns: ColumnNames<InsertData<Hallazgo>> = [
  'id_auditoria', 'evidencia', 'descripcion', 'norma', 'id_clausula',
  'label_clausula', 'tipo', 'severidad',
];
const hallazgosUpdateColumns: ColumnNames<UpdateData<Hallazgo>> = [
  'evidencia', 'descripcion', 'norma', 'id_clausula', 'label_clausula',
  'tipo', 'severidad',
];

const participantesInsertColumns: ColumnNames<InsertData<Participante>> = [
  'id_auditoria', 'nombre_completo', 'cargo_rol', 'correo_electronico',
  'asistio_reunion_inicial', 'asistio_reunion_cierre',
];
const participantesUpdateColumns: ColumnNames<UpdateData<Participante>> = [
  'nombre_completo', 'cargo_rol', 'correo_electronico',
  'asistio_reunion_inicial', 'asistio_reunion_cierre'
];

const verificacionDatosInsertColumns: ColumnNames<InsertData<VerificacionDatos>> = [
  'id_auditoria', 'datos_contacto', 'datos_alcance', 'datos_facturacion', 'comentarios_verificacion'
];
const verificacionDatosUpdateColumns: ColumnNames<UpdateData<VerificacionDatos>> = [
  'datos_contacto', 'datos_alcance', 'datos_facturacion', 'comentarios_verificacion'
];

const eficaciaInsertColumns: ColumnNames<InsertData<Eficacia>> = [
  'id_auditoria', 'tipo_auditoria', 'medio_utilizado', 'otro_medio', 'medio_efectivo',
  'inconvenientes_presentados', 'tipos_inconvenientes', 'otros_inconvenientes',
  'tecnicas_utilizadas', 'tecnicas_insitu_utilizadas', 'otras_tecnicas', 'otras_tecnicas_insitu'
];
const eficaciaUpdateColumns: ColumnNames<UpdateData<Eficacia>> = [
  'tipo_auditoria', 'medio_utilizado', 'otro_medio', 'medio_efectivo',
  'inconvenientes_presentados', 'tipos_inconvenientes', 'otros_inconvenientes',
  'tecnicas_utilizadas', 'tecnicas_insitu_utilizadas', 'otras_tecnicas', 'otras_tecnicas_insitu'
];

const conclusionesInsertColumns: ColumnNames<InsertData<Conclusion>> = [
  'id_auditoria', 'objetivos_cumplidos', 'desviacion_plan', 'sistema_cumple_norma'
];
const conclusionesUpdateColumns: ColumnNames<UpdateData<Conclusion>> = [
  'objetivos_cumplidos', 'desviacion_plan', 'sistema_cumple_norma'
];

async function createTables(): Promise<void> {
  const crearTablaHallazgos = `
  CREATE TABLE IF NOT EXISTS hallazgos (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL,
    proceso TEXT NOT NULL,
    descripcion TEXT,
    norma TEXT NOT NULL,
    id_clausula TEXT,
    label_clausula TEXT,
    tipo TEXT NOT NULL,
    severidad TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `;

  const crearTablaParticipantes = `
  CREATE TABLE IF NOT EXISTS participantes (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    cargo TEXT NOT NULL,
    departamento TEXT NOT NULL,
    asistio_reunion_inicial BOOLEAN DEFAULT FALSE,
    asistio_reunion_cierre BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `;

  const crearTablaVerificacionDatos = `
  CREATE TABLE IF NOT EXISTS verificacion_datos (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    nombre_organizacion_correcto BOOLEAN NOT NULL DEFAULT TRUE,
    nombre_organizacion TEXT,
    RUC_correcto BOOLEAN NOT NULL DEFAULT TRUE,
    RUC TEXT,
    persona_contacto_nombre TEXT,
    persona_contacto_cargo TEXT,
    persona_contacto_correo TEXT,
    persona_firma_marca_nombre TEXT,
    persona_firma_marca_cargo TEXT,
    direccion_principal TEXT,
    telefono TEXT,
    centros_incluidos_alcance TEXT,
    exclusiones_correctas BOOLEAN NOT NULL DEFAULT TRUE,
    exclusion_7152 BOOLEAN NOT NULL DEFAULT FALSE,
    exclusion_83 BOOLEAN NOT NULL DEFAULT FALSE,
    exclusion_851f BOOLEAN NOT NULL DEFAULT FALSE,
    exclusion_853 BOOLEAN NOT NULL DEFAULT FALSE,
    exclusion_855 BOOLEAN NOT NULL DEFAULT FALSE,
    numero_empleados_emplazamiento_json JSONB DEFAULT '{}'::jsonb,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `;

  const crearTablaEficacia = `
  CREATE TABLE IF NOT EXISTS eficacia (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    tipo_auditoria TEXT NOT NULL,
    medio_utilizado TEXT,
    otro_medio TEXT,
    medio_efectivo TEXT,
    inconvenientes_presentados TEXT,
    tipos_inconvenientes TEXT,
    otros_inconvenientes TEXT,
    tecnicas_utilizadas TEXT,
    tecnicas_insitu_utilizadas TEXT,
    otras_tecnicas TEXT,
    otras_tecnicas_insitu TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `;

  const crearTablaConclusiones = `
  CREATE TABLE IF NOT EXISTS conclusiones (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    objetivos_cumplidos TEXT NOT NULL DEFAULT 'si',
    desviacion_plan TEXT,
    sistema_cumple_norma TEXT NOT NULL DEFAULT 'si',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `;

  const crearTablaValoracionSG = `
  CREATE TABLE IF NOT EXISTS valoracion_sg (
    id SERIAL PRIMARY KEY,
    id_auditoria TEXT NOT NULL UNIQUE,
    proyectos_construccion_ubicacion TEXT,
    proyectos_instalacion_o_mantenimiento_auditado TEXT,
    sitios_instalaciones_clientes TEXT,
    sedes_auditdas TEXT,
    productos_servicios_auditdos TEXT,
    turnos_auditados_7_16 BOOLEAN NOT NULL DEFAULT FALSE,
    turnos_auditados_8_17 BOOLEAN NOT NULL DEFAULT FALSE,
    turnos_auditados_9_18 BOOLEAN NOT NULL DEFAULT FALSE,
    turnos_auditados_otro TEXT,
    modalidad_auditoria TEXT,
    periodicidad_auditoria_interna_anual BOOLEAN NOT NULL DEFAULT FALSE,
    periodicidad_auditoria_interna_semestral BOOLEAN NOT NULL DEFAULT FALSE,
    periodicidad_auditoria_interna_trimestral BOOLEAN NOT NULL DEFAULT FALSE,
    periodicidad_auditoria_interna_otra TEXT,
    periodicidad_segun_procesos TEXT,
    fecha_ultima_auditoria_interna DATE,
    evidencias_incluyen_programa_auditorias TEXT,
    evidencias_incluyen_plan_auditorias TEXT,
    evidencias_incluyen_informe_auditoria TEXT,
    evidencias_incluyen_listado_verificacion TEXT,
    evidencias_incluyen_evaluacion_auditores TEXT,
    //Aqui quede
    sistema_cumple_norma TEXT NOT NULL DEFAULT 'si',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `;

  try {
    await query(crearTablaHallazgos);
    await query(crearTablaParticipantes);
    await query(crearTablaVerificacionDatos);
    await query(crearTablaEficacia);
    await query(crearTablaConclusiones);
    await query(crearTablaValoracionSG);
    console.log('Tablas creadas o verificadas con éxito.');
  } catch (err) {
    console.error('Error al crear las tablas:', err);
  }
}

createTables();


function createGenericQueries<T extends { id: number | string }>(
    tableName: string,
    insertColumns: ColumnNames<InsertData<T>>,
    updateColumns: ColumnNames<UpdateData<T>>,
    uniqueKeyColumn?: keyof T
) {
  return {
    getAll: async (filterCol: keyof T, filterValue: string): Promise<T[]> => {
      const res = await query<T>(`SELECT * FROM ${tableName} WHERE ${String(filterCol)} = $1 ORDER BY fecha_creacion DESC`, [filterValue]);
      return res.rows;
    },
    getById: async (id: string): Promise<T | undefined> => {
      const res = await query<T>(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
      return res.rows[0];
    },
    create: async (data: Omit<T, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<T> => {
      const values = insertColumns.map(col => data[col]);
      const placeholders = insertColumns.map((_, i) => `$${i + 1}`).join(', ');
      const columns = insertColumns.join(', ');

      const res = await query<T>(
          `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
          values
      );
      return res.rows[0];
    },
    update: async (id: string, data: Partial<Omit<T, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>>, idColumn: keyof T = 'id' as keyof T): Promise<T> => {
      const values = [...updateColumns.map(col => (data as UpdateData<T>)[col]), id];

      const setClause = updateColumns.map((col, i) => `${String(col)} = $${i + 1}`).join(', ');

      const res = await query<T>(
          `UPDATE ${tableName} SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP WHERE ${String(idColumn)} = $${values.length} RETURNING *`,
          values
      );
      return res.rows[0];
    },
    upsert: async (data: Omit<T, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<T> => {
      if (!uniqueKeyColumn) {
        throw new Error(`Unique key column is required for upsert on table ${tableName}`);
      }
      const values = insertColumns.map(col => data[col]);
      const placeholders = insertColumns.map((_, i) => `$${i + 1}`).join(', ');
      const columns = insertColumns.join(', ');
      const updateSetClause = updateColumns.map((col) => `${String(col)} = EXCLUDED.${String(col)}`).join(', ');

      const res = await query<T>(
          `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})
         ON CONFLICT(${String(uniqueKeyColumn)}) DO UPDATE SET
           ${updateSetClause},
           fecha_actualizacion = CURRENT_TIMESTAMP
         RETURNING *`,
          values
      );
      return res.rows[0];
    },
    delete: async (id: string): Promise<{ id: string } | undefined> => {
      const res = await query<{ id: string }>(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);
      return res.rows[0];
    }
  };
}

export const hallazgosQueries = createGenericQueries<Hallazgo>(
    'hallazgos',
    hallazgosInsertColumns,
    hallazgosUpdateColumns
);

export const participantesQueries = createGenericQueries<Participante>(
    'participantes',
    participantesInsertColumns,
    participantesUpdateColumns
);

export const verificacionDatosQueries = createGenericQueries<VerificacionDatos>(
    'verificacion_datos',
    verificacionDatosInsertColumns,
    verificacionDatosUpdateColumns,
    'id_auditoria'
);

export const eficaciaQueries = createGenericQueries<Eficacia>(
    'eficacia',
    eficaciaInsertColumns,
    eficaciaUpdateColumns,
    'id_auditoria'
);

export const conclusionesQueries = createGenericQueries<Conclusion>(
    'conclusiones',
    conclusionesInsertColumns,
    conclusionesUpdateColumns,
    'id_auditoria'
);

export default pool;
