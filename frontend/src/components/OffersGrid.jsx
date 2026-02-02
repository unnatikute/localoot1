import { useState, useEffect } from 'react';
import { useApi } from '../api/client';
import { useStats } from '../store/stats';
import OfferCard from './OfferCard';

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
      area: 'Downtown',
    },
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
      area: 'Mall Road',
    },
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
      area: 'City Center',
    },
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
      area: 'Tech Park',
    },
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
      area: 'Wellness Zone',
    },
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
      area: 'Food Court',
    },
  },
];

export default function OffersGrid() {
  const [offers, setOffers] = useState(DEMO_OFFERS);
  const api = useApi();
  const stats = useStats();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.get('/offers?limit=12');
        if (response.data && (response.data.offers || response.data.length > 0)) {
          setOffers(response.data.offers || response.data);
        }
      } catch (error) {
        console.error('Error fetching offers, using demo data:', error);
      }
    };

    fetchOffers();
  }, [api]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer) => (
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
      ))}
    </div>
  );
}
