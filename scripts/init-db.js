import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SQL_PATH = path.join(__dirname, '..', 'src', 'setup.sql');

if (!process.env.DB_URL) {
    console.error('DB_URL is not set. Add it to .env before running this script.');
    process.exit(1);
}

const client = new Client({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false }
});

try {
    const sql = await readFile(SQL_PATH, 'utf8');

    console.log(`Connecting to database…`);
    await client.connect();

    console.log(`Running ${path.relative(process.cwd(), SQL_PATH)}…`);
    await client.query(sql);

    console.log('Database initialized successfully.');
} catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exitCode = 1;
} finally {
    await client.end();
}
