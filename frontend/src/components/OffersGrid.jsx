import { useState, useEffect } from 'react';
import { useApi } from '../api/client';
import { useStats } from '../store/stats';
import OfferCard from './OfferCard';

const DEMO_OFFERS = [/* keep your same demo data */];

export default function OffersGrid({ filters = [], location }) {
  const [offers, setOffers] = useState([]);
  const api = useApi();
  const stats = useStats();

  useEffect(() => {
    fetchOffers();
  }, [filters, location]);

  const fetchOffers = async () => {
    try {
      const response = await api.get('/offers', {
        params: {
          filters: filters.join(','), // "flash,trending"
          location,
          limit: 12,
        },
      });

      const raw = response.data?.offers || response.data || [];

      const normalized = raw.map((o) => ({
        ...o,
        image_url: o.image_url || o.imageUrl,
        discount:
          o.discount ||
          (o.originalPrice && o.price
            ? Math.round(((o.originalPrice - o.price) / o.originalPrice) * 100)
            : null),
        shop:
          o.shop ||
          (o.shopName
            ? { id: o.shopId || null, name: o.shopName, area: o.area }
            : o.shop),
      }));

      setOffers(normalized);
    } catch (error) {
      console.error('API failed, using demo data:', error);

      // 👉 fallback + apply filters locally
      let filtered = [...DEMO_OFFERS];

      // ⚡ FLASH (expiry soon)
      if (filters.includes('flash')) {
        filtered = filtered.filter((o) => {
          const expiry = new Date(o.valid_until);
          const now = new Date();
          const diffHours = (expiry - now) / (1000 * 60 * 60);
          return diffHours <= 24;
        });
      }

      // 📈 TRENDING
      if (filters.includes('trending')) {
        filtered = filtered.filter((o) => o.is_trending);
      }

      // ⭐ RATED
      if (filters.includes('rated')) {
        filtered = filtered.filter((o) => o.rating >= 4.5);
      }

      // 📍 DISTANCE (basic match)
      if (filters.includes('distance') && location) {
        filtered = filtered.filter((o) =>
          o.shop?.area?.toLowerCase().includes(location.toLowerCase())
        );
      }

      setOffers(filtered);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.length > 0 ? (
        offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onLike={async () => {
              if (stats.isOfferLiked(offer.id)) {
                try { await api.delete(`/offers/${offer.id}/like`); } catch {}
                stats.removeLikedOffer(offer.id);
              } else {
                try { await api.post(`/offers/${offer.id}/like`); } catch {}
                stats.addLikedOffer(offer);
              }
            }}
            onBookmark={async () => {
              if (stats.isOfferBookmarked(offer.id)) {
                try { await api.delete(`/offers/${offer.id}/bookmark`); } catch {}
                stats.removeBookmarkedOffer(offer.id);
              } else {
                try { await api.post(`/offers/${offer.id}/bookmark`); } catch {}
                stats.addBookmarkedOffer(offer);
              }
            }}
            linkState={{ offer, shop: offer.shop }}
          />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 py-10">
          No offers found 😔
        </div>
      )}
    </div>
  );
}
