import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.js';

const router = Router();

router.post('/', inventoryController.create);
router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getById);
router.get('/product/:productId', inventoryController.getByProduct);
router.put('/:id', inventoryController.update);
router.delete('/:id', inventoryController.remove);

export default router;