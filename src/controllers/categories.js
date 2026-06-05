import { body, validationResult } from 'express-validator';

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

const categoryValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters.')
        .isLength({ max: 100 }).withMessage('Category name must be 100 characters or fewer.')
];

const showCategories = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

const showCategoryDetails = async (req, res, next) => {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return next();
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
        return next();
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const title = category.name;

    res.render('category-details', { title, category, projects });
};

const showNewCategory = (req, res) => {
    res.render('new-category', {
        title: 'New Category',
        category: { name: '' },
        errors: []
    });
};

const processNewCategory = async (req, res) => {
    const errors = validationResult(req);
    const name = (req.body.name || '').trim();

    if (!errors.isEmpty()) {
        return res.status(400).render('new-category', {
            title: 'New Category',
            category: { name },
            errors: errors.array()
        });
    }

    await createCategory(name);
    res.redirect('/categories');
};

const showEditCategory = async (req, res, next) => {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return next();
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
        return next();
    }

    res.render('edit-category', {
        title: 'Edit Category',
        category,
        errors: []
    });
};

const processEditCategory = async (req, res, next) => {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return next();
    }

    const errors = validationResult(req);
    const name = (req.body.name || '').trim();

    if (!errors.isEmpty()) {
        return res.status(400).render('edit-category', {
            title: 'Edit Category',
            category: { category_id: categoryId, name },
            errors: errors.array()
        });
    }

    const updated = await updateCategory(categoryId, name);

    if (!updated) {
        return next();
    }

    res.redirect('/categories');
};

export {
    showCategories,
    showCategoryDetails,
    showNewCategory,
    processNewCategory,
    showEditCategory,
    processEditCategory,
    categoryValidationRules
};
