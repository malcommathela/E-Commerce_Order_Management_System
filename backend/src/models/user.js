import oracledb from 'oracledb';

export const user = {
    async create({ username, email, passwordHash, firstName, lastName, role, verificationCode, verificationExpiresAt }) {
        const conn = await oracledb.getConnection();
        const result = await conn.execute(
            `INSERT INTO USERS (
                username, email, password_hash, first_name, last_name,
                role, verification_code, verification_expires_at
            ) VALUES (
                :username, :email, :password_hash, :first_name, :last_name,
                :role, :verification_code, :verification_expires_at
            ) RETURNING user_id INTO :user_id`,
            {
                username,
                email,
                password_hash: passwordHash,
                first_name: firstName,
                last_name: lastName,
                role: role || 'MANAGER',
                verification_code: verificationCode,
                verification_expires_at: verificationExpiresAt,
                user_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );
        await conn.close();
        return result.outBinds.user_id[0];
    },

    async findByEmail(email) {
        const conn = await oracledb.getConnection();
        const result = await conn.execute(
            `SELECT user_id, username, email, password_hash, first_name, last_name,
                    role, email_verified, verification_code, verification_expires_at,
                    is_active, last_login_at, created_at, updated_at
             FROM USERS WHERE email = :email`,
            { email },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        await conn.close();
        return result.rows[0] || null;
    },

    async findByUsername(username) {
        const conn = await oracledb.getConnection();
        const result = await conn.execute(
            `SELECT user_id FROM USERS WHERE username = :username`,
            { username },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        await conn.close();
        return result.rows[0] || null;
    },

    async findById(userId) {
        const conn = await oracledb.getConnection();
        const result = await conn.execute(
            `SELECT user_id, username, email, first_name, last_name, role,
                    email_verified, is_active, last_login_at, created_at, updated_at
             FROM USERS WHERE user_id = :user_id`,
            { user_id: userId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        await conn.close();
        return result.rows[0] || null;
    },

    async verifyEmail(userId) {
        const conn = await oracledb.getConnection();
        await conn.execute(
            `UPDATE USERS
             SET email_verified = 1,
                 verification_code = NULL,
                 verification_expires_at = NULL
             WHERE user_id = :user_id`,
            { user_id: userId },
            { autoCommit: true }
        );
        await conn.close();
        return true;
    },

    async updateVerificationCode(userId, code, expiresAt) {
        const conn = await oracledb.getConnection();
        await conn.execute(
            `UPDATE USERS
             SET verification_code = :code,
                 verification_expires_at = :expires_at
             WHERE user_id = :user_id`,
            { user_id: userId, code, expires_at: expiresAt },
            { autoCommit: true }
        );
        await conn.close();
        return true;
    },

    async updateLastLogin(userId) {
        const conn = await oracledb.getConnection();
        await conn.execute(
            `UPDATE USERS SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = :user_id`,
            { user_id: userId },
            { autoCommit: true }
        );
        await conn.close();
        return true;
    }
};