import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN', 'MANAGER'), inventoryController.create);
router.get('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), inventoryController.getAll);
router.get('/:id', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), inventoryController.getById);
router.get('/product/:productId', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), inventoryController.getByProduct);
router.put('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), inventoryController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), inventoryController.remove);

export default router;