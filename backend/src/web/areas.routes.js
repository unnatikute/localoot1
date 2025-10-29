import { Router } from 'express';
import { ensureAuth, listAreas } from './areas.controller.js';

const router = Router();

router.get('/', ensureAuth, listAreas);

export default router;



