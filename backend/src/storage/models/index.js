import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(180), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(200), allowNull: false },
  avatar_url: { type: DataTypes.STRING(500) }
});

export const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
  banner_image_url: { type: DataTypes.STRING(500) }
});

export const Area = sequelize.define('area', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(160), allowNull: false },
  city: { type: DataTypes.STRING(160) }
});

export const Shop = sequelize.define('shop', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(180), allowNull: false },
  description: { type: DataTypes.TEXT },
  image_url: { type: DataTypes.STRING(500) },
  phone: { type: DataTypes.STRING(40) },
  address: { type: DataTypes.STRING(400) },
  map_lat: { type: DataTypes.DECIMAL(10, 7) },
  map_lng: { type: DataTypes.DECIMAL(10, 7) }
});

export const Offer = sequelize.define('offer', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  image_url: { type: DataTypes.STRING(500) },
  starts_at: { type: DataTypes.DATE },
  ends_at: { type: DataTypes.DATE },
  is_trending: { type: DataTypes.BOOLEAN, defaultValue: false }
});

export const OfferLike = sequelize.define('offer_like', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }
});

export const OfferBookmark = sequelize.define('offer_bookmark', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }
});

export const ShopSave = sequelize.define('shop_save', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }
});

// Associations
Category.hasMany(Shop, { foreignKey: { allowNull: false } });
Shop.belongsTo(Category);

Area.hasMany(Shop);
Shop.belongsTo(Area);

Shop.hasMany(Offer, { foreignKey: { allowNull: false } });
Offer.belongsTo(Shop);

Category.hasMany(Offer);
Offer.belongsTo(Category);

User.belongsToMany(Offer, { through: OfferLike, as: 'liked_offers' });
Offer.belongsToMany(User, { through: OfferLike, as: 'liked_by_users' });

User.belongsToMany(Offer, { through: OfferBookmark, as: 'bookmarked_offers' });
Offer.belongsToMany(User, { through: OfferBookmark, as: 'bookmarked_by_users' });

User.belongsToMany(Shop, { through: ShopSave, as: 'saved_shops' });
Shop.belongsToMany(User, { through: ShopSave, as: 'saved_by_users' });

export async function syncModels() {
  await sequelize.sync();
}


