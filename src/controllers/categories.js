import { getAllCategories, getCategoryById } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

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

export { showCategories, showCategoryDetails };
