import { Router } from 'express';
import { itemController } from '../controllers/item.js';

const router = Router();

router.post('/', itemController.create);
router.get('/', itemController.getAll);
router.get('/:id', itemController.getById);
router.get('/order/:orderId', itemController.getByOrder);
router.put('/:id', itemController.update);
router.delete('/:id', itemController.remove);

export default router;