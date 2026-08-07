import Inventory from '../models/inventory.js';

export const inventoryController = {
    async create(req, res) {
        try {
            const { product_id, warehouse_location, quantity_available } = req.body;
            if (!product_id) {
                return res.status(400).json({ success: false, message: 'product_id is required' });
            }
            const record = await Inventory.create({ product_id, warehouse_location, quantity_available });
            res.status(201).json({ success: true, data: record });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const records = await Inventory.findAll();
            res.status(200).json({ success: true, count: records.length, data: records });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const record = await Inventory.findById(Number(req.params.id));
            if (!record) return res.status(404).json({ success: false, message: 'Inventory record not found' });
            res.status(200).json({ success: true, data: record });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getByProduct(req, res) {
        try {
            const record = await Inventory.findByProduct(Number(req.params.productId));
            if (!record) return res.status(404).json({ success: false, message: 'Inventory not found for this product' });
            res.status(200).json({ success: true, data: record });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body;
            delete updates.inventory_id;
            delete updates.last_updated;
            const updated = await Inventory.update(Number(req.params.id), updates);
            if (!updated) return res.status(404).json({ success: false, message: 'Inventory record not found' });
            const record = await Inventory.findById(Number(req.params.id));
            res.status(200).json({ success: true, data: record });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await Inventory.delete(Number(req.params.id));
            if (!deleted) return res.status(404).json({ success: false, message: 'Inventory record not found' });
            res.status(200).json({ success: true, message: 'Inventory record deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};