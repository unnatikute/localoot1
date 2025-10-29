import { Shop, Category, Area, ShopSave } from '../storage/models/index.js';
import { requireAuth } from '../security/auth.middleware.js';

export const ensureAuth = requireAuth;

export async function getShop(req, res) {
  const { shopId } = req.params;
  const shop = await Shop.findByPk(shopId, { include: [Category, Area] });
  if (!shop) return res.status(404).json({ message: 'Shop not found' });
  res.json(shop);
}

export async function saveShop(req, res) {
  const { shopId } = req.params;
  const userId = req.user.id;
  await ShopSave.findOrCreate({ where: { userId, shopId }, defaults: { userId, shopId } });
  res.json({ ok: true });
}


