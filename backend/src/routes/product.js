import { Router } from 'express';
import { productController } from '../controllers/product.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN', 'MANAGER'), productController.create);
router.get('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), productController.getAll);
router.get('/:id', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), productController.getById);
router.get('/category/:categoryId', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), productController.getByCategory);
router.put('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), productController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), productController.remove);

export default router;