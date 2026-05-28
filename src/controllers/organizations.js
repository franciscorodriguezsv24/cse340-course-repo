import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

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

export { showOrganizations, showOrganizationDetails };
