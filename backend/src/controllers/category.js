import Category from '../models/category.js';

export const categoryController = {
    async create(req, res) {
        try {
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ success: false, message: 'name is required' });
            }
            const category = await Category.create({ name, description });
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const categories = await Category.findAll();
            res.status(200).json({ success: true, count: categories.length, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const category = await Category.findById(Number(req.params.id));
            if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body;
            delete updates.category_id;
            const updated = await Category.update(Number(req.params.id), updates);
            if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
            const category = await Category.findById(Number(req.params.id));
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await Category.delete(Number(req.params.id));
            if (!deleted) return res.status(404).json({ success: false, message: 'Category not found' });
            res.status(200).json({ success: true, message: 'Category deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};