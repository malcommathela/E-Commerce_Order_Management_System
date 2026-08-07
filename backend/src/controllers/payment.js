import Payment from '../models/payment.js';

export const paymentController = {
    async create(req, res) {
        try {
            const { order_id, payment_method, amount, payment_status } = req.body;
            if (!order_id || !payment_method || amount === undefined) {
                return res.status(400).json({ success: false, message: 'order_id, payment_method, and amount are required' });
            }
            const payment = await Payment.create({ order_id, payment_method, amount, payment_status });
            res.status(201).json({ success: true, data: payment });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const payments = await Payment.findAll();
            res.status(200).json({ success: true, count: payments.length, data: payments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const payment = await Payment.findById(Number(req.params.id));
            if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
            res.status(200).json({ success: true, data: payment });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getByOrder(req, res) {
        try {
            const payment = await Payment.findByOrder(Number(req.params.orderId));
            if (!payment) return res.status(404).json({ success: false, message: 'Payment not found for this order' });
            res.status(200).json({ success: true, data: payment });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body;
            delete updates.payment_id;
            delete updates.transaction_date;
            const updated = await Payment.update(Number(req.params.id), updates);
            if (!updated) return res.status(404).json({ success: false, message: 'Payment not found' });
            const payment = await Payment.findById(Number(req.params.id));
            res.status(200).json({ success: true, data: payment });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await Payment.delete(Number(req.params.id));
            if (!deleted) return res.status(404).json({ success: false, message: 'Payment not found' });
            res.status(200).json({ success: true, message: 'Payment deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};