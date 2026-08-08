import { Router } from 'express';
import { supplierController } from '../controllers/supplier.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN', 'MANAGER'), supplierController.create);
router.get('/', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), supplierController.getAll);
router.get('/:id', requireAuth, requireRole('ADMIN', 'MANAGER', 'STAFF'), supplierController.getById);
router.put('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), supplierController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'MANAGER'), supplierController.remove);

export default router;