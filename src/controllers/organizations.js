import { body, validationResult } from 'express-validator';

import {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const organizationValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required.')
        .isLength({ min: 3 }).withMessage('Organization name must be at least 3 characters.')
        .isLength({ max: 150 }).withMessage('Organization name must be 150 characters or fewer.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters.'),
    body('contact_email')
        .trim()
        .notEmpty().withMessage('Contact email is required.')
        .isEmail().withMessage('Contact email must be a valid email address.')
        .isLength({ max: 255 }).withMessage('Contact email must be 255 characters or fewer.'),
    body('logo_filename')
        .trim()
        .notEmpty().withMessage('Logo filename is required.')
        .isLength({ max: 255 }).withMessage('Logo filename must be 255 characters or fewer.')
];

const buildOrgFromBody = (body) => ({
    name: (body.name || '').trim(),
    description: (body.description || '').trim(),
    contact_email: (body.contact_email || '').trim(),
    logo_filename: (body.logo_filename || '').trim()
});

const showOrganizations = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetails = async (req, res, next) => {
    const organizationId = Number(req.params.id);

    if (!Number.isInteger(organizationId) || organizationId <= 0) {
        return next();
    }

    const organization = await getOrganizationById(organizationId);

    if (!organization) {
        return next();
    }

    const projects = await getProjectsByOrganizationId(organizationId);
    const title = organization.name;

    res.render('organization-details', { title, organization, projects });
};

const showNewOrganization = (req, res) => {
    res.render('new-organization', {
        title: 'New Organization',
        organization: { name: '', description: '', contact_email: '', logo_filename: '' },
        errors: []
    });
};

const processNewOrganization = async (req, res) => {
    const errors = validationResult(req);
    const organization = buildOrgFromBody(req.body);

    if (!errors.isEmpty()) {
        return res.status(400).render('new-organization', {
            title: 'New Organization',
            organization,
            errors: errors.array()
        });
    }

    const created = await createOrganization(organization);
    req.flash('success', `Organization "${created.name}" was created.`);
    res.redirect('/organizations');
};

const showEditOrganization = async (req, res, next) => {
    const organizationId = Number(req.params.id);

    if (!Number.isInteger(organizationId) || organizationId <= 0) {
        return next();
    }

    const organization = await getOrganizationById(organizationId);

    if (!organization) {
        return next();
    }

    res.render('edit-organization', {
        title: 'Edit Organization',
        organization,
        errors: []
    });
};

const processEditOrganization = async (req, res, next) => {
    const organizationId = Number(req.params.id);

    if (!Number.isInteger(organizationId) || organizationId <= 0) {
        return next();
    }

    const errors = validationResult(req);
    const organization = buildOrgFromBody(req.body);

    if (!errors.isEmpty()) {
        return res.status(400).render('edit-organization', {
            title: 'Edit Organization',
            organization: { organization_id: organizationId, ...organization },
            errors: errors.array()
        });
    }

    const updated = await updateOrganization(organizationId, organization);

    if (!updated) {
        return next();
    }

    req.flash('success', `Organization "${updated.name}" was updated.`);
    res.redirect('/organizations');
};

export {
    showOrganizations,
    showOrganizationDetails,
    showNewOrganization,
    processNewOrganization,
    showEditOrganization,
    processEditOrganization,
    organizationValidationRules
};
