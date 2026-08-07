import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

// Use thick mode if Oracle Instant Client is available (better performance)
// On Windows: set ORACLE_LIB_DIR=C:\oracle\instantclient_21_13
try {
    if (process.env.ORACLE_LIB_DIR) {
        oracledb.initOracleClient({ libDir: process.env.ORACLE_LIB_DIR });
        console.log('Oracle thick mode enabled');
    }
} catch (err) {
    console.log('Oracle thin mode (no local client needed)');
}

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB]; // Auto-convert CLOBs to strings

const dbConfig = {
    user: process.env.DB_USER || 'ecommerce_user',
    password: process.env.DB_PASSWORD || 'ecommerce_pass',
    connectString: process.env.DB_CONNECTION_STRING || 'localhost:1521/XEPDB1'
};

let pool;

export async function initializePool() {
    if (pool) return pool;

    try {
        pool = await oracledb.createPool({
            ...dbConfig,
            poolMin: 2,
            poolMax: 10,
            poolIncrement: 2,
            poolTimeout: 60,
            queueTimeout: 60000
        });
        console.log('Oracle connection pool initialized');
        return pool;
    } catch (err) {
        console.error('Failed to initialize Oracle pool:', err.message);
        throw err;
    }
}

export async function getConnection() {
    if (!pool) await initializePool();
    return pool.getConnection();
}

export async function closePool() {
    if (pool) {
        await pool.close(0);
        pool = null;
        console.log('Oracle connection pool closed');
    }
}

// Graceful shutdown helper
process.on('SIGINT', async () => {
    await closePool();
    process.exit(0);
});