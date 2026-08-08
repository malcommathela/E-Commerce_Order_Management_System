import { Router } from 'express';
import { categoryController } from '../controllers/category.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN', 'MANAGER'), categoryController.create);
router.get('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), categoryController.getAll);
router.get('/:id', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), categoryController.getById);
router.put('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), categoryController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), categoryController.remove);

export default router;