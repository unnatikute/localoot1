import { Offer, Shop, Category, OfferLike, OfferBookmark } from '../storage/models/index.js';
import { requireAuth } from '../security/auth.middleware.js';

export const ensureAuth = requireAuth;

export async function getOffer(req, res) {
  const { offerId } = req.params;
  const offer = await Offer.findByPk(offerId, {
    include: [
      { model: Shop, include: [Category] },
      { model: Category }
    ]
  });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  res.json(offer);
}

export async function likeOffer(req, res) {
  const { offerId } = req.params;
  const userId = req.user.id;
  await OfferLike.findOrCreate({ where: { userId, offerId }, defaults: { userId, offerId } });
  res.json({ ok: true });
}

export async function bookmarkOffer(req, res) {
  const { offerId } = req.params;
  const userId = req.user.id;
  await OfferBookmark.findOrCreate({ where: { userId, offerId }, defaults: { userId, offerId } });
  res.json({ ok: true });
}


