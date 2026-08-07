import { Router } from 'express';
import { supplierController } from '../controllers/supplier.js';

const router = Router();

router.post('/', supplierController.create);
router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);
router.put('/:id', supplierController.update);
router.delete('/:id', supplierController.remove);

export default router;