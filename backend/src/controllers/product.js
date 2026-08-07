import Product from '../models/product.js';

export const productController = {
    async create(req, res) {
        try {
            const { category_id, supplier_id, name, description, price, sku, stock_quantity } = req.body;
            if (!category_id || !name || price === undefined) {
                return res.status(400).json({ success: false, message: 'category_id, name, and price are required' });
            }
            const product = await Product.create({ category_id, supplier_id, name, description, price, sku, stock_quantity });
            res.status(201).json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const products = await Product.findAll();
            res.status(200).json({ success: true, count: products.length, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const product = await Product.findById(Number(req.params.id));
            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getByCategory(req, res) {
        try {
            const products = await Product.findByCategory(Number(req.params.categoryId));
            res.status(200).json({ success: true, count: products.length, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body;
            delete updates.product_id;
            delete updates.created_at;
            const updated = await Product.update(Number(req.params.id), updates);
            if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
            const product = await Product.findById(Number(req.params.id));
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await Product.delete(Number(req.params.id));
            if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
            res.status(200).json({ success: true, message: 'Product deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};