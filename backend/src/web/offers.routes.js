import { Router } from 'express';
import { ensureAuth, getOffer, likeOffer, bookmarkOffer } from './offers.controller.js';

const router = Router();

router.get('/:offerId', ensureAuth, getOffer);

router.post('/:offerId/like', ensureAuth, likeOffer);

router.post('/:offerId/bookmark', ensureAuth, bookmarkOffer);

export default router;


