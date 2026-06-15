import { Router } from 'express';
import {
    showProjects,
    showProjectDetails,
    volunteerForProject,
    removeVolunteerFromProject,
    showNewProject,
    processNewProject,
    showEditProject,
    processEditProject,
    showAssignCategories,
    processAssignCategories,
    projectValidationRules
} from '../controllers/projects.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

router.get('/projects', showProjects);
router.get('/new-project', showNewProject);
router.post('/new-project', projectValidationRules, processNewProject);
router.get('/edit-project/:id', showEditProject);
router.post('/edit-project/:id', projectValidationRules, processEditProject);
router.get('/assign-categories/:id', showAssignCategories);
router.post('/assign-categories/:id', processAssignCategories);
router.post('/project/:id/volunteer', requireLogin, volunteerForProject);
router.post('/project/:id/unvolunteer', requireLogin, removeVolunteerFromProject);
router.get('/project/:id', showProjectDetails);

export default router;
