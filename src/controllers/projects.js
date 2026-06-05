import { body, validationResult } from 'express-validator';

import {
    getUpcomingProjects,
    getProjectById,
    createProject,
    updateProject,
    setProjectCategories
} from '../models/projects.js';
import {
    getAllCategories,
    getCategoriesByProjectId
} from '../models/categories.js';
import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';

const projectValidationRules = [
    body('organization_id')
        .trim()
        .notEmpty().withMessage('Organization is required.')
        .isInt({ min: 1 }).withMessage('Organization must be a valid selection.')
        .toInt(),
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required.')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters.')
        .isLength({ max: 200 }).withMessage('Title must be 200 characters or fewer.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters.'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.')
        .isLength({ max: 200 }).withMessage('Location must be 200 characters or fewer.'),
    body('project_date')
        .trim()
        .notEmpty().withMessage('Project date is required.')
        .isISO8601({ strict: true }).withMessage('Project date must be a valid date (YYYY-MM-DD).')
];

const buildProjectFromBody = (body) => ({
    organization_id: body.organization_id ? Number(body.organization_id) : '',
    title: (body.title || '').trim(),
    description: (body.description || '').trim(),
    location: (body.location || '').trim(),
    project_date: (body.project_date || '').trim()
});

const formatDateInput = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.slice(0, 10);
    return new Date(value).toISOString().slice(0, 10);
};

const showProjects = async (req, res) => {
    const projects = await getUpcomingProjects(5);
    const title = 'Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetails = async (req, res, next) => {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
        return next();
    }

    const project = await getProjectById(projectId);

    if (!project) {
        return next();
    }

    const categories = await getCategoriesByProjectId(projectId);
    const title = project.title;

    res.render('project-details', { title, project, categories });
};

const showNewProject = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('new-project', {
        title: 'New Project',
        project: { organization_id: '', title: '', description: '', location: '', project_date: '' },
        organizations,
        errors: []
    });
};

const processNewProject = async (req, res) => {
    const errors = validationResult(req);
    const project = buildProjectFromBody(req.body);

    if (!errors.isEmpty()) {
        const organizations = await getAllOrganizations();
        return res.status(400).render('new-project', {
            title: 'New Project',
            project,
            organizations,
            errors: errors.array()
        });
    }

    const orgExists = await getOrganizationById(project.organization_id);
    if (!orgExists) {
        const organizations = await getAllOrganizations();
        return res.status(400).render('new-project', {
            title: 'New Project',
            project,
            organizations,
            errors: [{ msg: 'Selected organization does not exist.' }]
        });
    }

    const created = await createProject(project);
    req.flash('success', `Project "${created.title}" was created.`);
    res.redirect('/projects');
};

const showEditProject = async (req, res, next) => {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
        return next();
    }

    const project = await getProjectById(projectId);

    if (!project) {
        return next();
    }

    const organizations = await getAllOrganizations();

    res.render('edit-project', {
        title: 'Edit Project',
        project: { ...project, project_date: formatDateInput(project.project_date) },
        organizations,
        errors: []
    });
};

const processEditProject = async (req, res, next) => {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
        return next();
    }

    const errors = validationResult(req);
    const project = buildProjectFromBody(req.body);

    if (!errors.isEmpty()) {
        const organizations = await getAllOrganizations();
        return res.status(400).render('edit-project', {
            title: 'Edit Project',
            project: { project_id: projectId, ...project },
            organizations,
            errors: errors.array()
        });
    }

    const orgExists = await getOrganizationById(project.organization_id);
    if (!orgExists) {
        const organizations = await getAllOrganizations();
        return res.status(400).render('edit-project', {
            title: 'Edit Project',
            project: { project_id: projectId, ...project },
            organizations,
            errors: [{ msg: 'Selected organization does not exist.' }]
        });
    }

    const updated = await updateProject(projectId, project);

    if (!updated) {
        return next();
    }

    req.flash('success', `Project "${updated.title}" was updated.`);
    res.redirect('/projects');
};

const showAssignCategories = async (req, res, next) => {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
        return next();
    }

    const project = await getProjectById(projectId);

    if (!project) {
        return next();
    }

    const [allCategories, currentCategories] = await Promise.all([
        getAllCategories(),
        getCategoriesByProjectId(projectId)
    ]);

    const currentIds = new Set(currentCategories.map(c => c.category_id));

    res.render('assign-categories', {
        title: `Assign Categories: ${project.title}`,
        project,
        categories: allCategories.map(c => ({
            ...c,
            checked: currentIds.has(c.category_id)
        }))
    });
};

const processAssignCategories = async (req, res, next) => {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
        return next();
    }

    const project = await getProjectById(projectId);

    if (!project) {
        return next();
    }

    let raw = req.body.category_ids;
    if (raw === undefined) raw = [];
    if (!Array.isArray(raw)) raw = [raw];

    const categoryIds = raw
        .map(v => Number(v))
        .filter(v => Number.isInteger(v) && v > 0);

    await setProjectCategories(projectId, categoryIds);
    req.flash('success', `Categories updated for "${project.title}".`);
    res.redirect(`/project/${projectId}`);
};

export {
    showProjects,
    showProjectDetails,
    showNewProject,
    processNewProject,
    showEditProject,
    processEditProject,
    showAssignCategories,
    processAssignCategories,
    projectValidationRules
};
