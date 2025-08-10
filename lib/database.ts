import {Pool, QueryResult, QueryResultRow} from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function query <T extends QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
  console.info('Ejecutando consulta:', text, params);
  try {
    return pool.query<T>(text, params);
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    throw error;
  }
}

function getColumns<T extends object>(obj: T, update: boolean): (keyof T)[] {
  const filterKeys = ['id', 'fecha_creacion', 'fecha_actualizacion'] as (keyof T)[];

  if (update) {
    filterKeys.push('id_auditoria' as keyof T);
  }

  return (Object.keys(obj) as (keyof T)[]).filter(
      (key) => !filterKeys.includes(key)
  );
}

export async function getAll <T extends QueryResultRow>(tableName: string, filterCol: keyof T, filterValue: string): Promise<T[]> {
  const res = await query<T>(`SELECT * FROM ${tableName} WHERE ${String(filterCol)} = $1 ORDER BY fecha_creacion DESC`, [filterValue]);
  return res.rows;
}

export async function getById <T extends QueryResultRow>(tableName: string, id: string): Promise<T | undefined> {
  const res = await query<T>(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
  return res.rows[0];
}

export async function create <T extends QueryResultRow>(tableName: string, data: object): Promise<T> {
  const columns = getColumns(data, false);
  const values = columns.map(col => data[col]);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  const columnsString = columns.join(', ');

  const res = await query<T>(
      `INSERT INTO ${tableName} (${columnsString}) VALUES (${placeholders}) RETURNING *`,
      values
  );
  return res.rows[0];
}

export async function update <T extends QueryResultRow>(tableName: string, id: number, data: object): Promise<T> {
  const columns = getColumns(data, true);
  const values = [...columns.map(col => data[col]), id];

  const setClause = columns.map((col, i) => `${String(col)} = $${i + 1}`).join(', ');

  const res = await query<T>(
      `UPDATE ${tableName} SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *`,
      values
  );
  return res.rows[0];
}

export async function remove (tableName: string, id: string): Promise<{ id: string } | undefined> {
  const res = await query<{ id: string }>(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);
  return res.rows[0];
}

export default pool;
