import { Router } from 'express';
import { ensureAuth, listCategories, getTrendingOffers, getCategoryOffers } from './categories.controller.js';

const router = Router();

router.get('/', ensureAuth, listCategories);

router.get('/:categoryId/trending', ensureAuth, getTrendingOffers);

router.get('/:categoryId/offers', ensureAuth, getCategoryOffers);

export default router;


