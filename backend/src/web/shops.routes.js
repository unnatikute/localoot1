import { Router } from 'express';
import { ensureAuth, getShop, saveShop } from './shops.controller.js';

const router = Router();

router.get('/:shopId', ensureAuth, getShop);

router.post('/:shopId/save', ensureAuth, saveShop);

export default router;


