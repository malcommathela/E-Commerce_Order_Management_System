import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

const Payment = {
    async create({ order_id, payment_method, amount, payment_status }) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `INSERT INTO PAYMENT (order_id, payment_method, amount, payment_status)
         VALUES (:order_id, :payment_method, :amount, :payment_status)
         RETURNING payment_id INTO :id`,
                {
                    order_id, payment_method, amount,
                    payment_status: payment_status || 'PENDING',
                    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                },
                { autoCommit: true }
            );
            return { payment_id: result.outBinds.id[0], order_id, amount, payment_status: payment_status || 'PENDING' };
        } finally {
            await connection.close();
        }
    },

    async findAll() {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT p.payment_id, p.order_id, p.payment_method, p.amount, p.payment_status,
                p.transaction_date, o.status AS order_status
         FROM PAYMENT p
         JOIN ORDERS o ON p.order_id = o.order_id
         ORDER BY p.transaction_date DESC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async findById(payment_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT p.payment_id, p.order_id, p.payment_method, p.amount, p.payment_status,
                p.transaction_date, o.status AS order_status
         FROM PAYMENT p
         JOIN ORDERS o ON p.order_id = o.order_id
         WHERE p.payment_id = :payment_id`,
                { payment_id },
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
                `SELECT payment_id, order_id, payment_method, amount, payment_status, transaction_date
         FROM PAYMENT WHERE order_id = :order_id`,
                { order_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

    async update(payment_id, updates) {
        const connection = await getConnection();
        const fields = [];
        const binds = { payment_id };

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                fields.push(`${key} = :${key}`);
                binds[key] = updates[key];
            }
        });

        if (fields.length === 0) throw new Error('No fields provided for update');

        try {
            const result = await connection.execute(
                `UPDATE PAYMENT SET ${fields.join(', ')} WHERE payment_id = :payment_id`,
                binds,
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    },

    async delete(payment_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `DELETE FROM PAYMENT WHERE payment_id = :payment_id`,
                { payment_id },
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    }
};

export default Payment;