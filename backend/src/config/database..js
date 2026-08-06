import oracledb from 'oracledb';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
    user: process.env.DB_USER || 'ecommerce_user',
    password: process.env.DB_PASSWORD || 'ecommerce_pass',
    connectString: process.env.DB_CONNECTION_STRING || 'localhost:1521/XEPDB1'
};

let pool;

export async function initializePool() {
    if (pool) return pool;
    pool = await oracledb.createPool({
        ...dbConfig,
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 2
    });
    console.log('Oracle connection pool initialized');
    return pool;
}

export async function getConnection() {
    if (!pool) await initializePool();
    return pool.getConnection();
}

export async function closePool() {
    if (pool) {
        await pool.close();
        pool = null;
        console.log('Oracle connection pool closed');
    }
}