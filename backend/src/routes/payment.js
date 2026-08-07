import { Router } from 'express';
import { paymentController } from '../controllers/payment.js';

const router = Router();

router.post('/', paymentController.create);
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.get('/order/:orderId', paymentController.getByOrder);
router.put('/:id', paymentController.update);
router.delete('/:id', paymentController.remove);

export default router;