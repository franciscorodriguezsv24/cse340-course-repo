import { Router } from 'express';
import {
    showProjects,
    showProjectDetails,
    showNewProject,
    processNewProject,
    showEditProject,
    processEditProject,
    showAssignCategories,
    processAssignCategories,
    projectValidationRules
} from '../controllers/projects.js';

const router = Router();

router.get('/projects', showProjects);
router.get('/new-project', showNewProject);
router.post('/new-project', projectValidationRules, processNewProject);
router.get('/edit-project/:id', showEditProject);
router.post('/edit-project/:id', projectValidationRules, processEditProject);
router.get('/assign-categories/:id', showAssignCategories);
router.post('/assign-categories/:id', processAssignCategories);
router.get('/project/:id', showProjectDetails);

export default router;
