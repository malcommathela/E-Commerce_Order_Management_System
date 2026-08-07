import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConnection, initializePool, closePool } from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSchema() {
    try {
        await initializePool();
        const connection = await getConnection();

        const sqlPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split on standalone '/' lines (Oracle SQL*Plus standard)
        const statements = sql
            .split(/^\s*\/\s*$/gm)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            try {
                await connection.execute(statement);
                const firstLine = statement.split('\n')[0].trim();
                console.log('OK:', firstLine.substring(0, 60));
            } catch (err) {
                const firstLine = statement.split('\n')[0].trim();
                // Ignore "table does not exist" on DROP
                if (err.errorNum === 942 && firstLine.toUpperCase().startsWith('DROP')) {
                    console.log('SKIP (not found):', firstLine.substring(0, 50));
                } else {
                    console.error('FAIL:', firstLine.substring(0, 60));
                    console.error('  →', err.message.split('\n')[0]);
                }
            }
        }

        await connection.commit();
        console.log('\nSchema created successfully.');
        await connection.close();
    } catch (error) {
        console.error('Schema run failed:', error.message);
    } finally {
        await closePool();
    }
}

runSchema();