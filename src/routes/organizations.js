import { Router } from 'express';
import { showOrganizations, showOrganizationDetails } from '../controllers/organizations.js';

const router = Router();

router.get('/organizations', showOrganizations);
router.get('/organization/:id', showOrganizationDetails);

export default router;
