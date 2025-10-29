import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../store/auth.jsx';
import { createApi } from '../api/client.js';
import TrendingBanner from '../components/TrendingBanner.jsx';
import OfferCard from '../components/OfferCard.jsx';
import AreaFilter from '../components/AreaFilter.jsx';
import { useStats } from '../store/stats.jsx';

export default function Categories() {
  const { token } = useAuth();
  const api = useMemo(() => createApi(token), [token]);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [trending, setTrending] = useState([]);
  const [offers, setOffers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState('');
  const [areaQuery, setAreaQuery] = useState('');
  const stats = useStats();

  const FALLBACK_CATEGORIES = [
    { id: 'mock-food', name: 'Food & Dining', banner_image_url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1600&auto=format&fit=crop', _mock: true },
    { id: 'mock-fashion', name: 'Fashion', banner_image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop', _mock: true },
    { id: 'mock-electronics', name: 'Electronics', banner_image_url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop', _mock: true },
    { id: 'mock-beauty', name: 'Beauty & Wellness', banner_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop', _mock: true }
  ];

  useEffect(() => {
    let mounted = true;
    async function loadCats() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/categories');
        if (!mounted) return;
        const list = Array.isArray(data) && data.length ? data : FALLBACK_CATEGORIES;
        setCategories(list);
        if (list.length) setSelectedCategory(list[0]);
      } catch (e) {
        if (!mounted) return;
        setError(e.response?.data?.message || 'Failed to load categories');
        // fallback for flow demo
        setCategories(FALLBACK_CATEGORIES);
        setSelectedCategory(FALLBACK_CATEGORIES[0]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCats();
    return () => { mounted = false; };
  }, [api]);

  useEffect(() => {
    let mounted = true;
    async function loadAreas() {
      const { data } = await api.get('/areas', { params: { city: 'Pune', q: areaQuery || undefined } });
      if (mounted) setAreas(data);
    }
    loadAreas();
    // Re-load when query changes with small debounce could be added later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, areaQuery]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      if (!selectedCategory) return;
      if (selectedCategory._mock) {
        const mockShop = {
          id: 'mock-shop-1',
          name: 'Demo Shop',
          image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
          phone: '+91 98765 43210',
          address: 'Main Street, Pune',
          map_lat: 18.5204,
          map_lng: 73.8567
        };
        const mockOffers = [
          { id: 'mock-offer-1', title: 'Demo Buy 1 Get 1', description: 'Sample description to show flow', image_url: mockShop.image_url, is_trending: true, shop: mockShop, categoryId: selectedCategory.id },
          { id: 'mock-offer-2', title: 'Demo 20% Off', description: 'Sample description', image_url: mockShop.image_url, is_trending: false, shop: mockShop, categoryId: selectedCategory.id }
        ];
        if (!mounted) return;
        setTrending(mockOffers.filter(m => m.is_trending));
        setOffers(mockOffers);
        return;
      }
      const [t, o] = await Promise.all([
        api.get(`/categories/${selectedCategory.id}/trending`),
        api.get(`/categories/${selectedCategory.id}/offers`, { params: { areaId: areaId || undefined } })
      ]);
      if (!mounted) return;
      setTrending(t.data);
      setOffers(o.data);
    }
    loadData();
    return () => { mounted = false; };
  }, [api, selectedCategory, areaId]);

  return (
    <div className="space-y-6">
      {loading && <p>Loading categories...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && !error && categories.length === 0 && (
        <p>No categories available. Try reseeding the backend and refresh.</p>
      )}
      <div className="flex items-center gap-4">
        <select className="border rounded px-3 py-2" value={selectedCategory?.id || ''} onChange={(e) => {
          const c = categories.find(x => x.id === Number(e.target.value));
          setSelectedCategory(c || null);
        }}>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <AreaFilter areas={areas} value={areaId} onChange={setAreaId} />
        <input
          className="border rounded px-3 py-2"
          placeholder="Search area (Pune)"
          value={areaQuery}
          onChange={(e) => setAreaQuery(e.target.value)}
        />
      </div>

      {categories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">All categories</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap ${selectedCategory?.id === c.id ? 'bg-brand text-white border-brand' : 'bg-white hover:bg-gray-50'}`}
                title={c.name}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCategory && (
        <TrendingBanner image={selectedCategory.banner_image_url} title={`${selectedCategory.name} - Trending Offers`} subtitle={trending.length ? `${trending.length} hot offers right now` : 'Check back soon for hot offers'} />
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {offers.map(o => (
          <OfferCard
            key={o.id}
            offer={o}
            onLike={async () => {
              try { await api.post(`/offers/${o.id}/like`); } catch {}
              stats.addLikedOffer(o);
            }}
            onBookmark={async () => {
              try { await api.post(`/offers/${o.id}/bookmark`); } catch {}
              stats.addBookmarkedOffer(o);
            }}
            linkState={{ offer: o, shop: o.shop }}
          />
        ))}
      </div>
    </div>
  );
}


