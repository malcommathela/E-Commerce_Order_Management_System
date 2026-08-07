import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

const Inventory = {
    async create({ product_id, warehouse_location, quantity_available }) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `INSERT INTO INVENTORY (product_id, warehouse_location, quantity_available)
         VALUES (:product_id, :warehouse_location, :quantity_available)
         RETURNING inventory_id INTO :id`,
                {
                    product_id, warehouse_location, quantity_available,
                    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                },
                { autoCommit: true }
            );
            return { inventory_id: result.outBinds.id[0], product_id, quantity_available };
        } finally {
            await connection.close();
        }
    },

    async findAll() {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT i.inventory_id, i.warehouse_location, i.quantity_available,
                i.last_updated, p.name AS product_name, p.sku
         FROM INVENTORY i
         JOIN PRODUCT p ON i.product_id = p.product_id
         ORDER BY i.last_updated DESC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async findById(inventory_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT i.inventory_id, i.warehouse_location, i.quantity_available,
                i.last_updated, p.name AS product_name, p.sku
         FROM INVENTORY i
         JOIN PRODUCT p ON i.product_id = p.product_id
         WHERE i.inventory_id = :inventory_id`,
                { inventory_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

    async findByProduct(product_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT inventory_id, product_id, warehouse_location, quantity_available, last_updated
         FROM INVENTORY WHERE product_id = :product_id`,
                { product_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

    async update(inventory_id, updates) {
        const connection = await getConnection();
        const fields = [];
        const binds = { inventory_id };

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                fields.push(`${key} = :${key}`);
                binds[key] = updates[key];
            }
        });

        if (fields.length === 0) throw new Error('No fields provided for update');

        try {
            const result = await connection.execute(
                `UPDATE INVENTORY SET ${fields.join(', ')} WHERE inventory_id = :inventory_id`,
                binds,
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    },

    async delete(inventory_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `DELETE FROM INVENTORY WHERE inventory_id = :inventory_id`,
                { inventory_id },
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    }
};

export default Inventory;