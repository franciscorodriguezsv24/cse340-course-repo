import { Router } from 'express';
import { showCategories, showCategoryDetails } from '../controllers/categories.js';

const router = Router();

router.get('/categories', showCategories);
router.get('/category/:id', showCategoryDetails);

export default router;
