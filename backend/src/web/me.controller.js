import { OfferLike, OfferBookmark, ShopSave } from '../storage/models/index.js';
import { requireAuth } from '../security/auth.middleware.js';

export const ensureAuth = requireAuth;

export async function getNavbarStats(req, res) {
  const userId = req.user.id;
  const [likes, bookmarks, saves] = await Promise.all([
    OfferLike.count({ where: { userId } }),
    OfferBookmark.count({ where: { userId } }),
    ShopSave.count({ where: { userId } })
  ]);
  res.json({ likes, bookmarks, saves });
}


