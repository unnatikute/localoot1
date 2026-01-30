import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Share2, Star, MapPin, Flame } from 'lucide-react';
import { useApi } from '../api/client';

// Demo data for offers
const DEMO_OFFERS = [
  {
    id: 1,
    title: '50% OFF on All Pizzas',
    description: 'Fresh Italian pizzas with premium ingredients and toppings',
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=400&auto=format&fit=crop',
    discount: 50,
    price: 499,
    is_trending: true,
    rating: 4.6,
    reviews_count: 128,
    valid_until: '2024-02-15',
    shop: {
      id: 1,
      name: 'Pizza Palace',
      logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561cea?q=80&w=50&auto=format&fit=crop',
      area: 'Downtown'
    }
  },
  {
    id: 2,
    title: 'Flat 60% OFF Designer Dresses',
    description: 'Exclusive collection of designer dresses - Latest fashion trends',
    image_url: 'https://images.unsplash.com/photo-1595777712802-66d0c38e90a1?q=80&w=400&auto=format&fit=crop',
    discount: 60,
    price: 2999,
    is_trending: true,
    rating: 4.8,
    reviews_count: 256,
    valid_until: '2024-02-20',
    shop: {
      id: 2,
      name: 'Fashion Fiesta',
      logo: 'https://images.unsplash.com/photo-1506755855726-8ab0a63a4a1c?q=80&w=50&auto=format&fit=crop',
      area: 'Mall Road'
    }
  },
  {
    id: 3,
    title: 'Buy 1 Get 1 FREE on Coffee',
    description: 'Hot & fresh coffee with free pastries - Limited time offer',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?q=80&w=400&auto=format&fit=crop',
    discount: 50,
    price: 150,
    is_trending: true,
    rating: 4.5,
    reviews_count: 189,
    valid_until: '2024-02-10',
    shop: {
      id: 3,
      name: 'Coffee Brew Co.',
      logo: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=50&auto=format&fit=crop',
      area: 'City Center'
    }
  },
  {
    id: 4,
    title: 'SmartWatch 45% OFF',
    description: 'Latest smartwatch with fitness tracking and health monitoring',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
    discount: 45,
    price: 8999,
    is_trending: true,
    rating: 4.7,
    reviews_count: 342,
    valid_until: '2024-02-25',
    shop: {
      id: 4,
      name: 'Tech Hub',
      logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=50&auto=format&fit=crop',
      area: 'Tech Park'
    }
  },
  {
    id: 5,
    title: 'Spa Package - Upto 70% OFF',
    description: 'Complete spa package - massage, facial & body care treatments',
    image_url: 'https://images.unsplash.com/photo-1544161515-81205f8991e2?q=80&w=400&auto=format&fit=crop',
    discount: 70,
    price: 1999,
    is_trending: true,
    rating: 4.9,
    reviews_count: 217,
    valid_until: '2024-02-18',
    shop: {
      id: 5,
      name: 'Serenity Spa',
      logo: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?q=80&w=50&auto=format&fit=crop',
      area: 'Wellness Zone'
    }
  },
  {
    id: 6,
    title: 'Mega Burger Combo - 40% OFF',
    description: 'Delicious burger combo with fries and cold drink included',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop',
    discount: 40,
    price: 299,
    is_trending: false,
    rating: 4.4,
    reviews_count: 145,
    valid_until: '2024-02-12',
    shop: {
      id: 6,
      name: 'Burger House',
      logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=50&auto=format&fit=crop',
      area: 'Food Court'
    }
  },
];

export default function OffersGrid() {
  const [offers, setOffers] = useState(DEMO_OFFERS);
  const [liked, setLiked] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const api = useApi();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.get('/offers?limit=12');
        if (response.data && (response.data.offers || response.data.length > 0)) {
          setOffers(response.data.offers || response.data);
        }
        // If API returns nothing, keep using demo data
      } catch (error) {
        console.error('Error fetching offers, using demo data:', error);
        // Keep demo data on error - don't disrupt UI
      }
    };

    fetchOffers();
  }, [api]);

  const toggleLike = (offerId, e) => {
    e.preventDefault();
    setLiked((prev) => ({
      ...prev,
      [offerId]: !prev[offerId],
    }));
  };

  const toggleBookmark = (offerId, e) => {
    e.preventDefault();
    setBookmarked((prev) => ({
      ...prev,
      [offerId]: !prev[offerId],
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer) => (
        <Link key={offer.id} to={`/offers/${offer.id}`}>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col border border-gray-100">
            {/* Image Section */}
            <div className="relative h-40 bg-gray-100 overflow-hidden">
              <img
                src={offer.image_url || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(offer.title)}
                alt={offer.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />

              {/* Trending Badge */}
              {offer.is_trending && (
                <div className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white font-bold text-xs rounded-full flex items-center gap-1 shadow-lg">
                  <Flame className="w-3 h-3" /> Trending
                </div>
              )}

              {/* Discount Badge */}
              {offer.discount && (
                <div className="absolute top-2 left-2 px-3 py-1 bg-green-500 text-white font-bold text-sm rounded-full shadow-lg">
                  {offer.discount}% OFF
                </div>
              )}

              {/* Action Buttons - Top Right */}
              <div className="absolute top-2 right-12 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => toggleLike(offer.id, e)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                >
                  <Heart
                    className={`w-4 h-4 transition ${
                      liked[offer.id] ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
                <button
                  onClick={(e) => toggleBookmark(offer.id, e)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition"
                >
                  <Bookmark
                    className={`w-4 h-4 transition ${
                      bookmarked[offer.id] ? 'fill-blue-500 text-blue-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1">
              {/* Title */}
              <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">{offer.title}</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{offer.description || 'Limited time offer'}</p>

              {/* Shop Info */}
              {offer.shop && (
                <div className="mb-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-gray-600 mb-1">Available at</p>
                  <div className="flex items-center gap-2">
                    {offer.shop.logo && (
                      <img
                        src={offer.shop.logo}
                        alt={offer.shop.name}
                        className="w-6 h-6 rounded object-cover"
                      />
                    )}
                    <p className="font-semibold text-sm text-blue-700 line-clamp-1">{offer.shop.name}</p>
                  </div>
                  {offer.shop.area && (
                    <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{offer.shop.area}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Price Info */}
              <div className="mb-3 flex items-end gap-2">
                {offer.discount && (
                  <>
                    <span className="text-2xl font-bold text-gray-900">
                      {Math.round(offer.price * (1 - offer.discount / 100))}
                    </span>
                    <span className="text-sm text-gray-500 line-through">₹{offer.price}</span>
                  </>
                )}
              </div>

              {/* Rating */}
              {offer.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{offer.rating.toFixed(1)}</span>
                  </div>
                  {offer.reviews_count && (
                    <span className="text-gray-500 text-xs">({offer.reviews_count} reviews)</span>
                  )}
                </div>
              )}

              {/* Valid Until */}
              {offer.valid_until && (
                <div className="text-xs text-orange-600 font-semibold mb-3">
                  ⏰ Valid until {new Date(offer.valid_until).toLocaleDateString()}
                </div>
              )}

              {/* CTA Button */}
              <button className="w-full mt-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600 transition shadow-md hover:shadow-lg">
                View Details
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
