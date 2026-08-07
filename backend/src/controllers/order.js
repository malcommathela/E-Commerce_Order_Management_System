import Order from '../models/order.js';

export const orderController = {
    async create(req, res) {
        try {
            const { customer_id, status, total_amount, shipping_address } = req.body;
            if (!customer_id) {
                return res.status(400).json({ success: false, message: 'customer_id is required' });
            }
            const order = await Order.create({ customer_id, status, total_amount, shipping_address });
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const orders = await Order.findAll();
            res.status(200).json({ success: true, count: orders.length, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const order = await Order.findById(Number(req.params.id));
            if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getByCustomer(req, res) {
        try {
            const orders = await Order.findByCustomer(Number(req.params.customerId));
            res.status(200).json({ success: true, count: orders.length, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body;
            delete updates.order_id;
            delete updates.order_date;
            const updated = await Order.update(Number(req.params.id), updates);
            if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
            const order = await Order.findById(Number(req.params.id));
            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await Order.delete(Number(req.params.id));
            if (!deleted) return res.status(404).json({ success: false, message: 'Order not found' });
            res.status(200).json({ success: true, message: 'Order deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};