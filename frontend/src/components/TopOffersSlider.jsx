import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApi } from '../api/client';

export default function TopOffersSlider() {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const api = useApi();

  // ✅ FETCH ADMIN SELECTED TOP 5
  useEffect(() => {
    const fetchTopOffers = async () => {
      try {
        const response = await api.get('/admin/offers/top5');; // ✅ FIXED API

        if (response.data && response.data.length > 0) {
          const normalized = response.data.map((o) => ({
            ...o,
            image_url: o.image_url || o.imageUrl,
            discount:
              o.discount ||
              (o.originalPrice && o.price
                ? Math.round(((o.originalPrice - o.price) / o.originalPrice) * 100)
                : null),
            price: o.price || null,
            shop:
              o.shop ||
              (o.shopName
                ? {
                    id: o.shopId || null,
                    name: o.shopName,
                    logo: o.shopImage || null,
                    area: o.area,
                  }
                : null),
          }));

          setOffers(normalized);
        } else {
          setOffers([]);
        }
      } catch (error) {
        console.error('Error fetching top offers:', error);
        setOffers([]);
      }
    };

    fetchTopOffers();
  }, [api]);

  // ✅ AUTO SLIDE
  useEffect(() => {
    if (offers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [offers]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  // ❌ EMPTY STATE
  if (offers.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No Top Offers Available
      </div>
    );
  }

  const currentOffer = offers[currentIndex];

  return (
    <div className="relative h-96 rounded-2xl overflow-hidden group">
      
      {/* IMAGE */}
      <img
        src={
          currentOffer.image_url ||
          'https://images.unsplash.com/photo-1516321318423-f06f70b504b5?q=80&w=1600'
        }
        alt={currentOffer.title}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="p-8 text-white max-w-2xl">

          <span className="px-4 py-2 bg-red-500 text-sm rounded-full font-bold">
            🔥 Top Offer
          </span>

          <h2 className="text-4xl font-bold mt-4">
            {currentOffer.title}
          </h2>

          <p className="mt-2 text-gray-200">
            {currentOffer.description}
          </p>

          {currentOffer.shop && (
            <p className="mt-3 text-sm">
              {currentOffer.shop.name} • {currentOffer.shop.area}
            </p>
          )}

          <div className="mt-4 flex items-center gap-4">
            {currentOffer.discount && (
              <span className="text-2xl text-green-400 font-bold">
                {currentOffer.discount}% OFF
              </span>
            )}

            <Link
              to={`/offers/${currentOffer.id}`}
              state={{ offer: currentOffer }}
              className="px-6 py-2 bg-white text-black rounded"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <button onClick={goToPrevious} className="absolute left-4 top-1/2 text-white">
        <ChevronLeft />
      </button>

      <button onClick={goToNext} className="absolute right-4 top-1/2 text-white">
        <ChevronRight />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 ${
              i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
            } rounded-full`}
          />
        ))}
      </div>
    </div>
  );
}