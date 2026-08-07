import { getConnection} from "../config/database.js";
import oracledb from 'oracledb';

const customer = {

    async create({ first_name, last_name, email, phone, address, city, postal_code }) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `INSERT INTO CUSTOMER (first_name, last_name, email, phone, address, city, postal_code)
                VALUES (:first_name, :last_name, :email, :phone, :address, :city, :postal_code)
                RETURNING customer_id INTO :id`,
                {
                    first_name, last_name, email, phone, address, city, postal_code,
                    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                },
                { autoCommit: true }
            );
            return { customer_id: result.outBinds.id[0], first_name, last_name, email };
        }
        catch (e) {
            console.error("Error in creating customer", e);
        }
        finally {
            await connection.close();
        }

    },

    async delete(customer_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `DELETE FROM CUSTOMER WHERE customer_id = :customer_id`,
                { customer_id },
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        }
        catch (e) {
            console.error("Error in deleting customer", e);
        }
        finally {
            await connection.close();
        }
    },

    async update(customer_id, updates) {
        const connection = await getConnection();
        const fields = []
        const binds = {customer_id}

        // Build dynamic SET clause
        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                fields.push(`${key} = :${key}`);
                binds[key] = updates[key];
            }
        });

        if (fields.length === 0) {
            throw new Error("No fields provided for update.");
        }

        try {

            const result = await connection.execute(
                `UPDATE CUSTOMER
                SET ${fields.join(', ')}
                WHERE customer_id = :customer_id`,
                binds,
                { autoCommit: true }
            );

            return result.rowsAffected > 0;
        }
        finally {
            await connection.close();
        }


    },

    async findAll() {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT customer_id, first_name, last_name, email, phone, address, city, postal_code, created_at
         FROM CUSTOMER
         ORDER BY created_at DESC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async findById(customer_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT customer_id, first_name, last_name, email, phone, address, city, postal_code, created_at
         FROM CUSTOMER
         WHERE customer_id = :customer_id`,
                { customer_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

    async findByEmail(email) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT customer_id, first_name, last_name, email, phone, address, city, postal_code, created_at
         FROM CUSTOMER
         WHERE email = :email`,
                { email },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

}

export default customer;