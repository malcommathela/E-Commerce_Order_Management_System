import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

const Supplier = {
    async create({ name, contact_email, phone, address }) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `INSERT INTO SUPPLIER (name, contact_email, phone, address)
                 VALUES (:name, :contact_email, :phone, :address)
                     RETURNING supplier_id INTO :id`,
                {
                    name, contact_email, phone, address,
                    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                },
                { autoCommit: true }
            );
            return { supplier_id: result.outBinds.id[0], name, contact_email };
        } finally {
            await connection.close();
        }
    },

    async findAll() {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT supplier_id, name, contact_email, phone, address, created_at
                 FROM SUPPLIER ORDER BY created_at DESC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async findById(supplier_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT supplier_id, name, contact_email, phone, address, created_at
         FROM SUPPLIER WHERE supplier_id = :supplier_id`,
                { supplier_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

    async update(supplier_id, updates) {
        const connection = await getConnection();
        const fields = [];
        const binds = { supplier_id };

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                fields.push(`${key} = :${key}`);
                binds[key] = updates[key];
            }
        });

        if (fields.length === 0) throw new Error('No fields provided for update');

        try {
            const result = await connection.execute(
                `UPDATE SUPPLIER SET ${fields.join(', ')} WHERE supplier_id = :supplier_id`,
                binds,
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    },

    async delete(supplier_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `DELETE FROM SUPPLIER WHERE supplier_id = :supplier_id`,
                { supplier_id },
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    }
};

export default Supplier;