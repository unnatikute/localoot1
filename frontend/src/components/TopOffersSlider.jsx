import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApi } from '../api/client';

// Demo data for top 5 offers
const DEMO_TOP_OFFERS = [
  {
    id: 1,
    title: '50% OFF on All Pizzas',
    description: 'Amazing deal on all pizzas at Pizza Palace - Fresh, Hot & Delicious',
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1200&auto=format&fit=crop',
    discount: 50,
    price: 499,
    is_trending: true,
    shop: {
      id: 1,
      name: 'Pizza Palace',
      logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561cea?q=80&w=100&auto=format&fit=crop',
      area: 'Downtown'
    }
  },
  {
    id: 2,
    title: 'Flat 60% OFF on Designer Dresses',
    description: 'Exclusive collection of Designer Dresses - Latest Fashion Trends',
    image_url: 'https://images.unsplash.com/photo-1595777712802-66d0c38e90a1?q=80&w=1200&auto=format&fit=crop',
    discount: 60,
    price: 2999,
    is_trending: true,
    shop: {
      id: 2,
      name: 'Fashion Fiesta',
      logo: 'https://images.unsplash.com/photo-1506755855726-8ab0a63a4a1c?q=80&w=100&auto=format&fit=crop',
      area: 'Mall Road'
    }
  },
  {
    id: 3,
    title: 'Buy 1 Get 1 FREE on Coffee',
    description: 'Hot & Fresh Coffee with Free Pastries - Limited Time Offer',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?q=80&w=1200&auto=format&fit=crop',
    discount: 50,
    price: 150,
    is_trending: true,
    shop: {
      id: 3,
      name: 'Coffee Brew Co.',
      logo: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=100&auto=format&fit=crop',
      area: 'City Center'
    }
  },
  {
    id: 4,
    title: 'Smart Watches - 45% OFF',
    description: 'Latest SmartWatch Technology - Fitness & Health Tracking',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    discount: 45,
    price: 8999,
    is_trending: true,
    shop: {
      id: 4,
      name: 'Tech Hub',
      logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100&auto=format&fit=crop',
      area: 'Tech Park'
    }
  },
  {
    id: 5,
    title: 'Spa & Wellness - Upto 70% OFF',
    description: 'Relaxing Spa Services - Massage, Facial & Complete Body Care',
    image_url: 'https://images.unsplash.com/photo-1544161515-81205f8991e2?q=80&w=1200&auto=format&fit=crop',
    discount: 70,
    price: 1999,
    is_trending: true,
    shop: {
      id: 5,
      name: 'Serenity Spa',
      logo: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?q=80&w=100&auto=format&fit=crop',
      area: 'Wellness Zone'
    }
  }
];

export default function TopOffersSlider() {
  const [offers, setOffers] = useState(DEMO_TOP_OFFERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const api = useApi();

  useEffect(() => {
    const fetchTopOffers = async () => {
      try {
        const response = await api.get('/offers?sort=trending&limit=5');
        if (response.data && (response.data.offers || response.data.length > 0)) {
          setOffers(response.data.offers || response.data);
        }
        // If API returns nothing, keep using demo data
      } catch (error) {
        console.error('Error fetching top offers, using demo data:', error);
        // Keep demo data on error - don't disrupt UI
      }
    };

    fetchTopOffers();
  }, [api]);

  useEffect(() => {
    if (offers.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000); // 5 second interval
    return () => clearInterval(interval);
  }, [offers]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  if (offers.length === 0) {
    return null;
  }

  const currentOffer = offers[currentIndex];

  return (
    <div className="relative h-96 rounded-2xl overflow-hidden group">
      {/* Slider Container */}
      <div className="relative h-full">
        {/* Main Slide */}
        <div className="absolute inset-0 transition-all duration-500 ease-out">
          <img
            src={currentOffer.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f70b504b5?q=80&w=1600&auto=format&fit=crop'}
            alt={currentOffer.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="p-8 text-white max-w-2xl">
            <div className="inline-block mb-3">
              <span className="px-4 py-2 bg-red-500 text-white font-bold text-sm rounded-full">
                🔥 TOP OFFER OF THE DAY
              </span>
            </div>
            <h2 className="text-5xl font-bold mb-3 leading-tight">{currentOffer.title}</h2>
            <p className="text-lg text-gray-100 mb-6 max-w-xl">{currentOffer.description}</p>
            
            {currentOffer.shop && (
              <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full overflow-hidden">
                  <img src={currentOffer.shop.logo || 'https://via.placeholder.com/48'} alt={currentOffer.shop.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{currentOffer.shop.name}</p>
                  <p className="text-xs text-gray-200">{currentOffer.shop.area || 'Local Shop'}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-6">
              {currentOffer.discount && (
                <div>
                  <p className="text-sm text-gray-200">Discount</p>
                  <p className="text-3xl font-bold text-green-400">{currentOffer.discount}% OFF</p>
                </div>
              )}
              <Link
                to={`/offers/${currentOffer.id}`}
                state={{ offer: currentOffer }}
                className="inline-block px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full transition backdrop-blur-sm group-hover:opacity-100 opacity-0"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full transition backdrop-blur-sm group-hover:opacity-100 opacity-0"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 z-20 bg-black/40 px-3 py-2 rounded-full text-white text-sm font-semibold backdrop-blur-sm">
        {currentIndex + 1} / {offers.length}
      </div>
    </div>
  );
}
