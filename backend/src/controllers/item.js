import Item from '../models/item.js';

export const itemController = {
    async create(req, res) {
        try {
            const { order_id, product_id, quantity, unit_price } = req.body;
            if (!order_id || !product_id || !quantity || unit_price === undefined) {
                return res.status(400).json({ success: false, message: 'order_id, product_id, quantity, and unit_price are required' });
            }
            const item = await Item.create({ order_id, product_id, quantity, unit_price });
            res.status(201).json({ success: true, data: item });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const items = await Item.findAll();
            res.status(200).json({ success: true, count: items.length, data: items });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const item = await Item.findById(Number(req.params.id));
            if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
            res.status(200).json({ success: true, data: item });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getByOrder(req, res) {
        try {
            const items = await Item.findByOrder(Number(req.params.orderId));
            res.status(200).json({ success: true, count: items.length, data: items });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body;
            delete updates.order_item_id;
            delete updates.subtotal;
            const updated = await Item.update(Number(req.params.id), updates);
            if (!updated) return res.status(404).json({ success: false, message: 'Item not found' });
            const item = await Item.findById(Number(req.params.id));
            res.status(200).json({ success: true, data: item });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await Item.delete(Number(req.params.id));
            if (!deleted) return res.status(404).json({ success: false, message: 'Item not found' });
            res.status(200).json({ success: true, message: 'Item deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};