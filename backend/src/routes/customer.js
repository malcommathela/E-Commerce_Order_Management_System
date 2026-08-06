import { Router } from 'express';
import { customerController } from '../controllers/customer.js';

const router = Router();

router.post('/', customerController.create);
router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.remove);

export default router;