import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

const Order = {
    async create({ customer_id, status, total_amount, shipping_address }) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `INSERT INTO ORDERS (customer_id, status, total_amount, shipping_address)
         VALUES (:customer_id, :status, :total_amount, :shipping_address)
         RETURNING order_id INTO :id`,
                {
                    customer_id,
                    status: status || 'PENDING',
                    total_amount: total_amount || 0,
                    shipping_address,
                    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                },
                { autoCommit: true }
            );
            return { order_id: result.outBinds.id[0], customer_id, status: status || 'PENDING' };
        } finally {
            await connection.close();
        }
    },

    async findAll() {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT o.order_id, o.order_date, o.status, o.total_amount, o.shipping_address,
                c.first_name || ' ' || c.last_name AS customer_name, c.email
         FROM ORDERS o
         JOIN CUSTOMER c ON o.customer_id = c.customer_id
         ORDER BY o.order_date DESC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async findById(order_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT o.order_id, o.order_date, o.status, o.total_amount, o.shipping_address,
                c.first_name || ' ' || c.last_name AS customer_name, c.email
         FROM ORDERS o
         JOIN CUSTOMER c ON o.customer_id = c.customer_id
         WHERE o.order_id = :order_id`,
                { order_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

    async findByCustomer(customer_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT order_id, order_date, status, total_amount, shipping_address
         FROM ORDERS WHERE customer_id = :customer_id ORDER BY order_date DESC`,
                { customer_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async update(order_id, updates) {
        const connection = await getConnection();
        const fields = [];
        const binds = { order_id };

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                fields.push(`${key} = :${key}`);
                binds[key] = updates[key];
            }
        });

        if (fields.length === 0) throw new Error('No fields provided for update');

        try {
            const result = await connection.execute(
                `UPDATE ORDERS SET ${fields.join(', ')} WHERE order_id = :order_id`,
                binds,
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    },

    async delete(order_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `DELETE FROM ORDERS WHERE order_id = :order_id`,
                { order_id },
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    }
};

export default Order;