import { getUpcomingProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

export { showProjects, showProjectDetails };
