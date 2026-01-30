import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, Share2 } from 'lucide-react';
import { useApi } from '../api/client';

// Demo data for shops
const DEMO_SHOPS = [
  {
    id: 1,
    name: 'Pizza Palace',
    logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561cea?q=80&w=200&auto=format&fit=crop',
    area: 'Downtown',
    rating: 4.5,
    reviews_count: 128,
    description: 'Authentic Italian pizzas with premium ingredients',
    category: 'Food',
    tags: ['Pizza', 'Italian', 'Dine-in', 'Delivery'],
    is_featured: true
  },
  {
    id: 2,
    name: 'Fashion Fiesta',
    logo: 'https://images.unsplash.com/photo-1506755855726-8ab0a63a4a1c?q=80&w=200&auto=format&fit=crop',
    area: 'Mall Road',
    rating: 4.8,
    reviews_count: 256,
    description: 'Latest fashion trends at affordable prices',
    category: 'Fashion',
    tags: ['Clothing', 'Accessories', 'Trending'],
    is_featured: true
  },
  {
    id: 3,
    name: 'Coffee Brew Co.',
    logo: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=200&auto=format&fit=crop',
    area: 'City Center',
    rating: 4.6,
    reviews_count: 189,
    description: 'Premium specialty coffee and pastries',
    category: 'Cafe',
    tags: ['Coffee', 'Pastries', 'Cafe'],
    is_featured: false
  },
  {
    id: 4,
    name: 'Tech Hub',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop',
    area: 'Tech Park',
    rating: 4.7,
    reviews_count: 342,
    description: 'Latest gadgets and electronics',
    category: 'Electronics',
    tags: ['Gadgets', 'SmartPhones', 'Warranty'],
    is_featured: true
  },
  {
    id: 5,
    name: 'Serenity Spa',
    logo: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?q=80&w=200&auto=format&fit=crop',
    area: 'Wellness Zone',
    rating: 4.9,
    reviews_count: 217,
    description: 'Relaxing spa and wellness center',
    category: 'Beauty',
    tags: ['Spa', 'Massage', 'Wellness'],
    is_featured: true
  },
  {
    id: 6,
    name: 'Burger House',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop',
    area: 'Food Court',
    rating: 4.4,
    reviews_count: 145,
    description: 'Delicious burgers and fast food',
    category: 'Food',
    tags: ['Burgers', 'FastFood', 'Delivery'],
    is_featured: false
  },
  {
    id: 7,
    name: 'Beauty Corner',
    logo: 'https://images.unsplash.com/photo-1564870841619-06d33f8e8fcd?q=80&w=200&auto=format&fit=crop',
    area: 'Market Street',
    rating: 4.3,
    reviews_count: 98,
    description: 'Cosmetics and beauty products',
    category: 'Beauty',
    tags: ['Makeup', 'Skincare', 'Perfume'],
    is_featured: false
  },
  {
    id: 8,
    name: 'BookwormCafe',
    logo: 'https://images.unsplash.com/photo-1507842217343-583f20270319?q=80&w=200&auto=format&fit=crop',
    area: 'Literature Hub',
    rating: 4.7,
    reviews_count: 176,
    description: 'Books and cozy cafe ambiance',
    category: 'Entertainment',
    tags: ['Books', 'Cafe', 'Reading'],
    is_featured: true
  }
];

export default function ShopGrid() {
  const [shops, setShops] = useState(DEMO_SHOPS);
  const [liked, setLiked] = useState({});
  const api = useApi();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await api.get('/shops?limit=8');
        if (response.data && (response.data.shops || response.data.length > 0)) {
          setShops(response.data.shops || response.data);
        }
        // If API returns nothing, keep using demo data
      } catch (error) {
        console.error('Error fetching shops, using demo data:', error);
        // Keep demo data on error - don't disrupt UI
      }
    };

    fetchShops();
  }, [api]);

  const toggleLike = (shopId) => {
    setLiked((prev) => ({
      ...prev,
      [shopId]: !prev[shopId],
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {shops.map((shop) => (
        <Link key={shop.id} to={`/shops/${shop.id}`}>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
            {/* Shop Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={shop.logo || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(shop.name)}
                alt={shop.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              
              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleLike(shop.id);
                }}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition z-10"
              >
                <Heart
                  className={`w-5 h-5 transition ${
                    liked[shop.id] ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>

              {/* Badge */}
              {shop.is_featured && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                  ⭐ Featured
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">{shop.name}</h3>
              
              {/* Location */}
              {shop.area && (
                <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{shop.area}</span>
                </div>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm text-gray-900">
                    {shop.rating ? shop.rating.toFixed(1) : '4.5'}
                  </span>
                </div>
                <span className="text-gray-500 text-xs">
                  ({shop.reviews_count || 120} reviews)
                </span>
              </div>

              {/* Description */}
              {shop.description && (
                <p className="text-gray-600 text-xs line-clamp-2 mb-3">{shop.description}</p>
              )}

              {/* Category Tags */}
              <div className="flex gap-2 flex-wrap mb-4">
                {shop.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {shop.category}
                  </span>
                )}
                {shop.tags?.slice(0, 1).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition text-sm">
                  View Offers
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
