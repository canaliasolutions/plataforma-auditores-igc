import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { readdirSync } from 'fs';
import {dirname, resolve} from 'path';
import {fileURLToPath, pathToFileURL } from "url";

dotenv.config({ path: '.env.local' });

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function runMigrations() {
    const client = await pool.connect();
    console.log('Connected to database. Running migrations...');

    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        const migrationFiles = readdirSync(resolve(__dirname, '../migrations'))
            .filter(file => file.endsWith('.js'))
            .sort();

        const appliedMigrationsResult = await client.query('SELECT name FROM migrations;');
        const appliedMigrations = new Set(appliedMigrationsResult.rows.map(row => row.name));

        for (const fileName of migrationFiles) {
            if (!appliedMigrations.has(fileName)) {
                console.log(`Applying migration: ${fileName}`);

                const filePath = resolve(__dirname, '../migrations', fileName);
                const fileUrl = pathToFileURL(filePath).href;

                const migrationModule = await import(fileUrl);

                await client.query('BEGIN');
                await migrationModule.up(client)
                await client.query('INSERT INTO migrations (name) VALUES ($1)', [fileName]);
                await client.query('COMMIT');
            }
        }

        console.log('All migrations ran successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
        await client.query('ROLLBACK');
        process.exit(1);
    } finally {
        client.release();
    }
}

runMigrations().catch(err => {
    console.error('Error running migrations:', err);
    process.exit(1);
}).finally(() => {
    pool.end();
});