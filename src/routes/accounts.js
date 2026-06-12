import { Router } from 'express';
import {
    showRegister,
    processRegister,
    showLogin,
    processLogin,
    logout,
    showDashboard,
    showUsers,
    registerValidationRules,
    loginValidationRules
} from '../controllers/accounts.js';
import { requireLogin, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/register', showRegister);
router.post('/register', registerValidationRules, processRegister);
router.get('/login', showLogin);
router.post('/login', loginValidationRules, processLogin);
router.post('/logout', logout);

router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, requireRole('admin'), showUsers);

export default router;
