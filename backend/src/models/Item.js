import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

const Item = {
    async create({ order_id, product_id, quantity, unit_price }) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `INSERT INTO ORDER_ITEM (order_id, product_id, quantity, unit_price)
                 VALUES (:order_id, :product_id, :quantity, :unit_price)
                     RETURNING order_item_id INTO :id`,
                {
                    order_id, product_id, quantity, unit_price,
                    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                },
                { autoCommit: true }
            );
            return { order_item_id: result.outBinds.id[0], order_id, product_id, quantity, unit_price };
        } finally {
            await connection.close();
        }
    },

    async findAll() {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT oi.order_item_id, oi.order_id, oi.quantity, oi.unit_price, oi.subtotal,
                        p.name AS product_name, p.sku
                 FROM ORDER_ITEM oi
                          JOIN PRODUCT p ON oi.product_id = p.product_id
                 ORDER BY oi.order_item_id DESC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async findById(order_item_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT oi.order_item_id, oi.order_id, oi.quantity, oi.unit_price, oi.subtotal,
                        p.name AS product_name, p.sku
                 FROM ORDER_ITEM oi
                          JOIN PRODUCT p ON oi.product_id = p.product_id
                 WHERE oi.order_item_id = :order_item_id`,
                { order_item_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

    async findByOrder(order_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT oi.order_item_id, oi.product_id, oi.quantity, oi.unit_price, oi.subtotal,
                        p.name AS product_name, p.sku
                 FROM ORDER_ITEM oi
                          JOIN PRODUCT p ON oi.product_id = p.product_id
                 WHERE oi.order_id = :order_id`,
                { order_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async update(order_item_id, updates) {
        const connection = await getConnection();
        const fields = [];
        const binds = { order_item_id };

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                fields.push(`${key} = :${key}`);
                binds[key] = updates[key];
            }
        });

        if (fields.length === 0) throw new Error('No fields provided for update');

        try {
            const result = await connection.execute(
                `UPDATE ORDER_ITEM SET ${fields.join(', ')} WHERE order_item_id = :order_item_id`,
                binds,
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    },

    async delete(order_item_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `DELETE FROM ORDER_ITEM WHERE order_item_id = :order_item_id`,
                { order_item_id },
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    }
};

export default Item;