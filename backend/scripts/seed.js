import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConnection, initializePool, closePool } from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
    try {
        await initializePool();
        const connection = await getConnection();

        const sqlPath = path.join(__dirname, 'seed.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8').trim();

        await connection.execute(sql);
        console.log('Seed data inserted successfully.');

        await connection.close();
    } catch (error) {
        console.error('Seed failed:', error.message);
    } finally {
        await closePool();
    }
}

runSeed();