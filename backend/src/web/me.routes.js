import { Router } from 'express';
import { ensureAuth, getNavbarStats } from './me.controller.js';

const router = Router();

router.get('/nav', ensureAuth, getNavbarStats);

export default router;


