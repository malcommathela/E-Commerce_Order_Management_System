import Supplier from '../models/supplier.js';

export const supplierController = {
    async create(req, res) {
        try {
            const { name, contact_email, phone, address } = req.body;
            if (!name) {
                return res.status(400).json({ success: false, message: 'name is required' });
            }
            const supplier = await Supplier.create({ name, contact_email, phone, address });
            res.status(201).json({ success: true, data: supplier });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const suppliers = await Supplier.findAll();
            res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const supplier = await Supplier.findById(Number(req.params.id));
            if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
            res.status(200).json({ success: true, data: supplier });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body;
            delete updates.supplier_id;
            delete updates.created_at;
            const updated = await Supplier.update(Number(req.params.id), updates);
            if (!updated) return res.status(404).json({ success: false, message: 'Supplier not found' });
            const supplier = await Supplier.findById(Number(req.params.id));
            res.status(200).json({ success: true, data: supplier });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await Supplier.delete(Number(req.params.id));
            if (!deleted) return res.status(404).json({ success: false, message: 'Supplier not found' });
            res.status(200).json({ success: true, message: 'Supplier deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};