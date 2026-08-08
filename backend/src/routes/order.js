import { Router } from 'express';
import { orderController } from '../controllers/order.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), orderController.create);
router.get('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), orderController.getAll);
router.get('/:id', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), orderController.getById);
router.get('/customer/:customerId', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), orderController.getByCustomer);
router.put('/:id', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), orderController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), orderController.remove);

export default router;