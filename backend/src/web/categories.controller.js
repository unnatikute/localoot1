import { Op } from 'sequelize';
import { Category, Offer, Shop, Area } from '../storage/models/index.js';
import { requireAuth } from '../security/auth.middleware.js';

export const ensureAuth = requireAuth;

export async function listCategories(_req, res) {
  const categories = await Category.findAll({ order: [['name', 'ASC']] });
  res.json(categories);
}

export async function getTrendingOffers(req, res) {
  const { categoryId } = req.params;
  const offers = await Offer.findAll({
    where: { categoryId, is_trending: true, ends_at: { [Op.or]: [null, { [Op.gt]: new Date() }] } },
    include: [{ model: Shop, attributes: ['id', 'name', 'image_url'] }],
    order: [['updatedAt', 'DESC']],
    limit: 10
  });
  res.json(offers);
}

export async function getCategoryOffers(req, res) {
  const { categoryId } = req.params;
  const { areaId } = req.query;
  const where = { categoryId };
  if (areaId) where.shopId = { [Op.in]: (await Shop.findAll({ where: { areaId }, attributes: ['id'] })).map(s => s.id) };

  const offers = await Offer.findAll({
    where,
    include: [
      { model: Shop, include: [{ model: Area }] },
      { model: Category, attributes: ['id', 'name', 'slug'] }
    ],
    order: [['updatedAt', 'DESC']]
  });
  res.json(offers);
}


