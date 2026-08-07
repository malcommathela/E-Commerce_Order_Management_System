import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

const Product = {
    async create({ category_id, supplier_id, name, description, price, sku, stock_quantity }) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `INSERT INTO PRODUCT (category_id, supplier_id, name, description, price, sku, stock_quantity)
         VALUES (:category_id, :supplier_id, :name, :description, :price, :sku, :stock_quantity)
         RETURNING product_id INTO :id`,
                {
                    category_id, supplier_id, name, description, price, sku, stock_quantity,
                    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                },
                { autoCommit: true }
            );
            return { product_id: result.outBinds.id[0], name, price, sku };
        } finally {
            await connection.close();
        }
    },

    async findAll() {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT p.product_id, p.name, p.description, p.price, p.sku, p.stock_quantity,
                p.created_at, c.name AS category_name, s.name AS supplier_name
         FROM PRODUCT p
         JOIN CATEGORY c ON p.category_id = c.category_id
         LEFT JOIN SUPPLIER s ON p.supplier_id = s.supplier_id
         ORDER BY p.created_at DESC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async findById(product_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT p.product_id, p.name, p.description, p.price, p.sku, p.stock_quantity,
                p.created_at, c.name AS category_name, s.name AS supplier_name
         FROM PRODUCT p
         JOIN CATEGORY c ON p.category_id = c.category_id
         LEFT JOIN SUPPLIER s ON p.supplier_id = s.supplier_id
         WHERE p.product_id = :product_id`,
                { product_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows[0] || null;
        } finally {
            await connection.close();
        }
    },

    async findByCategory(category_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `SELECT product_id, name, price, sku, stock_quantity
         FROM PRODUCT WHERE category_id = :category_id`,
                { category_id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return result.rows;
        } finally {
            await connection.close();
        }
    },

    async update(product_id, updates) {
        const connection = await getConnection();
        const fields = [];
        const binds = { product_id };

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                fields.push(`${key} = :${key}`);
                binds[key] = updates[key];
            }
        });

        if (fields.length === 0) throw new Error('No fields provided for update');

        try {
            const result = await connection.execute(
                `UPDATE PRODUCT SET ${fields.join(', ')} WHERE product_id = :product_id`,
                binds,
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    },

    async delete(product_id) {
        const connection = await getConnection();
        try {
            const result = await connection.execute(
                `DELETE FROM PRODUCT WHERE product_id = :product_id`,
                { product_id },
                { autoCommit: true }
            );
            return result.rowsAffected > 0;
        } finally {
            await connection.close();
        }
    }
};

export default Product;