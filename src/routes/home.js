import { Router } from 'express';
import { showHome } from '../controllers/home.js';

const router = Router();

router.get('/', showHome);

export default router;
