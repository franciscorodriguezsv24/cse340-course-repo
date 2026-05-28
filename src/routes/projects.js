import { Router } from 'express';
import { showProjects, showProjectDetails } from '../controllers/projects.js';

const router = Router();

router.get('/projects', showProjects);
router.get('/project/:id', showProjectDetails);

export default router;
