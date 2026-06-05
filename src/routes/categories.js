import { Router } from 'express';
import {
    showCategories,
    showCategoryDetails,
    showNewCategory,
    processNewCategory,
    showEditCategory,
    processEditCategory,
    categoryValidationRules
} from '../controllers/categories.js';

const router = Router();

router.get('/categories', showCategories);
router.get('/new-category', showNewCategory);
router.post('/new-category', categoryValidationRules, processNewCategory);
router.get('/edit-category/:id', showEditCategory);
router.post('/edit-category/:id', categoryValidationRules, processEditCategory);
router.get('/category/:id', showCategoryDetails);

export default router;
