import Database from 'better-sqlite3';
import path from 'path';

// Set up the database file path
const dbPath = path.resolve(process.cwd(), 'portalAuditores.db');
const db = new Database(dbPath);

// Create the hallazgos (findings/non-conformities) table
const createHallazgosTable = `
CREATE TABLE IF NOT EXISTS hallazgos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  auditoria_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  clausula TEXT NOT NULL,
  severidad TEXT NOT NULL DEFAULT 'menor',
  estado TEXT NOT NULL DEFAULT 'abierto',
  fecha_encontrado TEXT NOT NULL,
  fecha_resuelto TEXT,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Create the participantes (participants) table
const createParticipantesTable = `
CREATE TABLE IF NOT EXISTS participantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  auditoria_id TEXT NOT NULL,
  nombre_completo TEXT NOT NULL,
  cargo_rol TEXT NOT NULL,
  correo_electronico TEXT NOT NULL,
  asistio_reunion_inicial INTEGER DEFAULT 0,
  asistio_reunion_cierre INTEGER DEFAULT 0,
  fecha_agregado TEXT NOT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Create the verificacion_datos (data verification) table
const createVerificacionDatosTable = `
CREATE TABLE IF NOT EXISTS verificacion_datos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  auditoria_id TEXT NOT NULL UNIQUE,
  datos_contacto TEXT NOT NULL DEFAULT 'correcto',
  datos_alcance TEXT NOT NULL DEFAULT 'correcto',
  datos_facturacion TEXT NOT NULL DEFAULT 'correcto',
  comentarios_verificacion TEXT,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Create the eficacia (effectiveness) table
const createEficaciaTable = `
CREATE TABLE IF NOT EXISTS eficacia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  auditoria_id TEXT NOT NULL UNIQUE,
  tipo_auditoria TEXT NOT NULL DEFAULT 'in_situ',
  medio_utilizado TEXT,
  otro_medio TEXT,
  medio_efectivo TEXT,
  inconvenientes_presentados TEXT,
  tipos_inconvenientes TEXT,
  otros_inconvenientes TEXT,
  tecnicas_utilizadas TEXT,
  otras_tecnicas TEXT,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Create the conclusiones (conclusions) table
const createConclusionesTable = `
CREATE TABLE IF NOT EXISTS conclusiones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  auditoria_id TEXT NOT NULL UNIQUE,
  objetivos_cumplidos TEXT NOT NULL DEFAULT 'si',
  desviacion_plan TEXT,
  sistema_cumple_norma TEXT NOT NULL DEFAULT 'si',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Execute table creation
db.exec(createHallazgosTable);
db.exec(createParticipantesTable);
db.exec(createVerificacionDatosTable);
db.exec(createEficaciaTable);
db.exec(createConclusionesTable);

// Prepare common queries for hallazgos
export const hallazgosQueries = {
  getAll: db.prepare('SELECT * FROM hallazgos WHERE auditoria_id = ? ORDER BY fecha_creacion DESC'),
  getById: db.prepare('SELECT * FROM hallazgos WHERE id = ?'),
  create: db.prepare(`
    INSERT INTO hallazgos (auditoria_id, titulo, descripcion, clausula, severidad, estado, fecha_encontrado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE hallazgos
    SET titulo = ?, descripcion = ?, clausula = ?, severidad = ?, estado = ?, fecha_resuelto = ?, fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  delete: db.prepare('DELETE FROM hallazgos WHERE id = ?')
};

// Prepare common queries for participantes
export const participantesQueries = {
  getAll: db.prepare('SELECT * FROM participantes WHERE auditoria_id = ? ORDER BY fecha_creacion DESC'),
  getById: db.prepare('SELECT * FROM participantes WHERE id = ?'),
  create: db.prepare(`
    INSERT INTO participantes (auditoria_id, nombre_completo, cargo_rol, correo_electronico, asistio_reunion_inicial, asistio_reunion_cierre, fecha_agregado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE participantes
    SET nombre_completo = ?, cargo_rol = ?, correo_electronico = ?, asistio_reunion_inicial = ?, asistio_reunion_cierre = ?, fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  delete: db.prepare('DELETE FROM participantes WHERE id = ?')
};

// Prepare common queries for verificacion_datos
export const verificacionDatosQueries = {
  getByAuditId: db.prepare('SELECT * FROM verificacion_datos WHERE auditoria_id = ?'),
  create: db.prepare(`
    INSERT INTO verificacion_datos (auditoria_id, datos_contacto, datos_alcance, datos_facturacion, comentarios_verificacion)
    VALUES (?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE verificacion_datos
    SET datos_contacto = ?, datos_alcance = ?, datos_facturacion = ?, comentarios_verificacion = ?, fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE auditoria_id = ?
  `),
  upsert: db.prepare(`
    INSERT INTO verificacion_datos (auditoria_id, datos_contacto, datos_alcance, datos_facturacion, comentarios_verificacion)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(auditoria_id) DO UPDATE SET
      datos_contacto = excluded.datos_contacto,
      datos_alcance = excluded.datos_alcance,
      datos_facturacion = excluded.datos_facturacion,
      comentarios_verificacion = excluded.comentarios_verificacion,
      fecha_actualizacion = CURRENT_TIMESTAMP
  `)
};

// Prepare common queries for eficacia
export const eficaciaQueries = {
  getByAuditId: db.prepare('SELECT * FROM eficacia WHERE auditoria_id = ?'),
  create: db.prepare(`
    INSERT INTO eficacia (auditoria_id, tipo_auditoria, medio_utilizado, otro_medio, medio_efectivo, inconvenientes_presentados, tipos_inconvenientes, otros_inconvenientes, tecnicas_utilizadas, otras_tecnicas)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE eficacia
    SET tipo_auditoria = ?, medio_utilizado = ?, otro_medio = ?, medio_efectivo = ?, inconvenientes_presentados = ?, tipos_inconvenientes = ?, otros_inconvenientes = ?, tecnicas_utilizadas = ?, otras_tecnicas = ?, fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE auditoria_id = ?
  `),
  upsert: db.prepare(`
    INSERT INTO eficacia (auditoria_id, tipo_auditoria, medio_utilizado, otro_medio, medio_efectivo, inconvenientes_presentados, tipos_inconvenientes, otros_inconvenientes, tecnicas_utilizadas, otras_tecnicas)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(auditoria_id) DO UPDATE SET
      tipo_auditoria = excluded.tipo_auditoria,
      medio_utilizado = excluded.medio_utilizado,
      otro_medio = excluded.otro_medio,
      medio_efectivo = excluded.medio_efectivo,
      inconvenientes_presentados = excluded.inconvenientes_presentados,
      tipos_inconvenientes = excluded.tipos_inconvenientes,
      otros_inconvenientes = excluded.otros_inconvenientes,
      tecnicas_utilizadas = excluded.tecnicas_utilizadas,
      otras_tecnicas = excluded.otras_tecnicas,
      fecha_actualizacion = CURRENT_TIMESTAMP
  `)
};

// Prepare common queries for conclusiones
export const conclusionesQueries = {
  getByAuditId: db.prepare('SELECT * FROM conclusiones WHERE auditoria_id = ?'),
  create: db.prepare(`
    INSERT INTO conclusiones (auditoria_id, objetivos_cumplidos, desviacion_plan, sistema_cumple_norma)
    VALUES (?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE conclusiones
    SET objetivos_cumplidos = ?, desviacion_plan = ?, sistema_cumple_norma = ?, fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE auditoria_id = ?
  `),
  upsert: db.prepare(`
    INSERT INTO conclusiones (auditoria_id, objetivos_cumplidos, desviacion_plan, sistema_cumple_norma)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(auditoria_id) DO UPDATE SET
      objetivos_cumplidos = excluded.objetivos_cumplidos,
      desviacion_plan = excluded.desviacion_plan,
      sistema_cumple_norma = excluded.sistema_cumple_norma,
      fecha_actualizacion = CURRENT_TIMESTAMP
  `)
};

export default db;
