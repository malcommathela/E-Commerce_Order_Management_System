import bcrypt from 'bcryptjs';  // or 'bcrypt', whichever your project already uses
import { getConnection, initializePool, closePool } from '../src/config/database.js';

async function createAdmin() {
    try {
        await initializePool();
        const conn = await getConnection();
        const hash = await bcrypt.hash('admin123', 10);
        await conn.execute(
            `INSERT INTO USERS (username, email, password_hash, first_name, last_name, role, email_verified, is_active)
             VALUES (:username, :email, :hash, :fn, :ln, 'ADMIN', 1, 1)`,
            {
                username: 'admin',
                email: 'root@gmail.com',
                hash,
                fn: 'System',
                ln: 'Admin'
            }
        );
        await conn.commit();
        console.log('Admin created → admin / admin123');
        await conn.close();
    } catch (e) {
        console.error('Failed:', e.message);
    } finally {
        await closePool();
    }
}

createAdmin();