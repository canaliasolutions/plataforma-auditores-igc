import Database from 'better-sqlite3';
import path from 'path';

// Set up the database file path
const dbPath = path.resolve(process.cwd(), 'portalAuditores.db');
const db = new Database(dbPath);

// Create the non_conformities table if it doesn't exist
const createTable = `
CREATE TABLE IF NOT EXISTS hallazgos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
db.exec(createTable);

export default db;

