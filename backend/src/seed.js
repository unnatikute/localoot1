import './loadEnv.js';
import { sequelize } from './storage/db.js';
import { Category, Area, Shop, Offer } from './storage/models/index.js';

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  const categories = await Category.bulkCreate([
    { name: 'Food & Dining', slug: 'food-dining', banner_image_url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Fashion', slug: 'fashion', banner_image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Electronics', slug: 'electronics', banner_image_url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Groceries', slug: 'groceries', banner_image_url: 'https://images.unsplash.com/photo-1511690078903-71dc5a29b19d?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Beauty & Wellness', slug: 'beauty-wellness', banner_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Fitness', slug: 'fitness', banner_image_url: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Home & Furniture', slug: 'home-furniture', banner_image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Travel', slug: 'travel', banner_image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop' }
  ]);

  const areas = await Area.bulkCreate([
    { name: 'Kothrud', city: 'Pune' },
    { name: 'Baner', city: 'Pune' },
    { name: 'Viman Nagar', city: 'Pune' },
    { name: 'Kharadi', city: 'Pune' },
    { name: 'Hinjawadi', city: 'Pune' },
    { name: 'Shivajinagar', city: 'Pune' }
  ]);

  const shop1 = await Shop.create({
    name: 'Burger Hub',
    description: 'Gourmet burgers and fries',
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop',
    phone: '+1 555 100 200',
    address: '123 FC Road, Shivajinagar, Pune',
    map_lat: 19.076,
    map_lng: 72.8777,
    categoryId: categories[0].id,
    areaId: areas.find(a => a.name === 'Shivajinagar').id
  });

  const shop2 = await Shop.create({
    name: 'Style Street',
    description: 'Trendy apparel and accessories',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    phone: '+1 555 200 300',
    address: '45 High Street, Baner, Pune',
    map_lat: 19.08,
    map_lng: 72.88,
    categoryId: categories[1].id,
    areaId: areas.find(a => a.name === 'Baner').id
  });

  const shop3 = await Shop.create({
    name: 'FitFlex Gym',
    description: 'Premium fitness center with personal trainers',
    image_url: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1600&auto=format&fit=crop',
    phone: '+1 555 300 400',
    address: 'IT Park Rd, Hinjawadi, Pune',
    map_lat: 18.59,
    map_lng: 73.73,
    categoryId: categories.find(c => c.slug === 'fitness').id,
    areaId: areas.find(a => a.name === 'Hinjawadi').id
  });

  const shop4 = await Shop.create({
    name: 'Glow Beauty Salon',
    description: 'Spa and salon services',
    image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    phone: '+1 555 400 500',
    address: 'Phoenix Marketcity, Viman Nagar, Pune',
    map_lat: 18.57,
    map_lng: 73.91,
    categoryId: categories.find(c => c.slug === 'beauty-wellness').id,
    areaId: areas.find(a => a.name === 'Viman Nagar').id
  });

  await Offer.bulkCreate([
    { title: 'Buy 1 Get 1 Free', description: 'On classic burgers', image_url: 'https://images.unsplash.com/photo-1550547660-8b00a1b7537f?q=80&w=1600&auto=format&fit=crop', starts_at: new Date(), ends_at: null, is_trending: true, shopId: shop1.id, categoryId: categories[0].id },
    { title: '20% Off', description: 'All jeans this weekend', image_url: 'https://images.unsplash.com/photo-1445205171083-17446d7c36f1?q=80&w=1600&auto=format&fit=crop', starts_at: new Date(), ends_at: null, is_trending: true, shopId: shop2.id, categoryId: categories[1].id },
    { title: 'Flat ₹500 Off on Headphones', description: 'Limited stock', image_url: 'https://images.unsplash.com/photo-1518446316509-0615ed6e4d16?q=80&w=1600&auto=format&fit=crop', starts_at: new Date(), ends_at: null, is_trending: false, shopId: shop2.id, categoryId: categories[2].id },
    { title: 'Membership 30% Off', description: 'Annual plan discount', image_url: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1600&auto=format&fit=crop', starts_at: new Date(), ends_at: null, is_trending: true, shopId: shop3.id, categoryId: categories.find(c => c.slug === 'fitness').id },
    { title: 'Salon Fest 25% Off', description: 'On spa packages', image_url: 'https://images.unsplash.com/photo-1556227701-9348495c0610?q=80&w=1600&auto=format&fit=crop', starts_at: new Date(), ends_at: null, is_trending: true, shopId: shop4.id, categoryId: categories.find(c => c.slug === 'beauty-wellness').id }
  ]);

  console.log('Seed completed');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});


