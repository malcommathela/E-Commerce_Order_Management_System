import { Router } from 'express';
import { itemController } from '../controllers/item.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), itemController.create);
router.get('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), itemController.getAll);
router.get('/:id', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), itemController.getById);
router.get('/order/:orderId', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), itemController.getByOrder);
router.put('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), itemController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), itemController.remove);

export default router;