import { Router } from 'express';
import { productController } from '../controllers/product.js';

const router = Router();

router.post('/', productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.get('/category/:categoryId', productController.getByCategory);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

export default router;