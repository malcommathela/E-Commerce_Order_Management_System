import { Router } from 'express';
import { customerController } from '../controllers/customer.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN', 'MANAGER'), customerController.create);
router.get('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), customerController.getAll);
router.get('/:id', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), customerController.getById);
router.put('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), customerController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), customerController.remove);

export default router;