import Customer from '../models/customer.js';

export const customerController = {

    async create(req, res) {
        try {
            const { first_name, last_name, email, phone, address, city, postal_code } = req.body
            if (!first_name || !last_name || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'First name, Last name and Email are required'
                })
            }

            const existing = await Customer.findByEmail(email);
            if(existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                })
            }

            const customer = await Customer.create({
                first_name,
                last_name,
                email,
                phone,
                address,
                city,
                postal_code
            });

            res.status(201).json({
                success: true,
                data: customer
            });
        }
        catch (error) {
            console.error('Error creating customer:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create customer',
                error: error.message
            });

        }

    },

    async getAll(req, res) {
        try {
            const customers = await Customer.findAll();
            res.status(200).json({
                success: true,
                count: customers.length,
                data: customers
            });
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch customers',
                error: error.message
            });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const customer = await Customer.findById(Number(id));

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            res.status(200).json({
                success: true,
                data: customer
            });
        } catch (error) {
            console.error('Error fetching customer:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch customer',
                error: error.message
            });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            // Prevent updating PK or created_at
            delete updates.customer_id;
            delete updates.created_at;

            const updated = await Customer.update(Number(id), updates);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found or no changes made'
                });
            }

            const customer = await Customer.findById(Number(id));

            res.status(200).json({
                success: true,
                message: 'Customer updated successfully',
                data: customer
            });
        } catch (error) {
            console.error('Error updating customer:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update customer',
                error: error.message
            });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Customer.delete(Number(id));

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Customer deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting customer:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete customer',
                error: error.message
            });
        }
    }

}