import { Op } from 'sequelize';
import { Area } from '../storage/models/index.js';
import { requireAuth } from '../security/auth.middleware.js';

export const ensureAuth = requireAuth;

export async function listAreas(req, res) {
  const { q, city } = req.query;
  const where = {};
  if (city) where.city = city;
  if (q) where.name = { [Op.like]: `%${q}%` };
  const areas = await Area.findAll({ where, order: [['name', 'ASC']] });
  res.json(areas);
}



