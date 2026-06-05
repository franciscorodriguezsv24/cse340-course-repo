import { Router } from 'express';
import {
    showOrganizations,
    showOrganizationDetails,
    showNewOrganization,
    processNewOrganization,
    showEditOrganization,
    processEditOrganization,
    organizationValidationRules
} from '../controllers/organizations.js';

const router = Router();

router.get('/organizations', showOrganizations);
router.get('/new-organization', showNewOrganization);
router.post('/new-organization', organizationValidationRules, processNewOrganization);
router.get('/edit-organization/:id', showEditOrganization);
router.post('/edit-organization/:id', organizationValidationRules, processEditOrganization);
router.get('/organization/:id', showOrganizationDetails);

export default router;
