import { Router } from 'express';
import { paymentController } from '../controllers/payment.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN', 'MANAGER'), paymentController.create);
router.get('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), paymentController.getAll);
router.get('/:id', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), paymentController.getById);
router.get('/order/:orderId', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), paymentController.getByOrder);
router.put('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), paymentController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), paymentController.remove);

export default router;