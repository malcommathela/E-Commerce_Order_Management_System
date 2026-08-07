import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

const Category = {
    async create({ name, description }) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `INSERT INTO CATEGORY (name, description)
         VALUES (:name, :description)
         RETURNING category_id INTO :id`,
                {
                    name, description,
                    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                },
                { autoCommit: true }
            );
            return { category_id: result.outBinds.id[0], name, description };
        } finally {
            await connection.close();
        }
    },

    async findAll() {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT category_id, name, description FROM CATEGORY ORDER BY name`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async findById(category_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT category_id, name, description FROM CATEGORY WHERE category_id = :category_id`,
                { category_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

    async update(category_id, updates) {
        const connection = await getConnection();
        const fields = [];
        const binds = { category_id };

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                fields.push(`${key} = :${key}`);
                binds[key] = updates[key];
            }
        });

        if (fields.length === 0) throw new Error('No fields provided for update');

        try {
            const result = await connection.execute(
                `UPDATE CATEGORY SET ${fields.join(', ')} WHERE category_id = :category_id`,
                binds,
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    },

    async delete(category_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `DELETE FROM CATEGORY WHERE category_id = :category_id`,
                { category_id },
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    }
};

export default Category;