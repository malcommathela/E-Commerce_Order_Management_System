import { Router } from 'express';
import { orderController } from '../controllers/order.js';

const router = Router();

router.post('/', orderController.create);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.get('/customer/:customerId', orderController.getByCustomer);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.remove);

export default router;