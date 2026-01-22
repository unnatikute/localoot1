import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../store/auth.jsx';
import { createApi } from '../api/client.js';
import OfferCard from '../components/OfferCard.jsx';
import { useStats } from '../store/stats.jsx';

export default function MyBookmarks() {
  const { token } = useAuth();
  const api = useMemo(() => createApi(token), [token]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const stats = useStats();

  useEffect(() => {
    let mounted = true;
    async function loadBookmarks() {
      setLoading(true);
      try {
        // Try API first
        const { data } = await api.get('/me/bookmarks');
        if (mounted) setOffers(Array.isArray(data) ? data : []);
      } catch (e) {
        // Fallback to stats store (works without database)
        console.log('Using stats store for bookmarks');
        if (mounted) {
          const bookmarkedFromStore = stats.bookmarkedOffers || [];
          setOffers(bookmarkedFromStore);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadBookmarks();
    return () => { mounted = false; };
  }, [api, stats.bookmarkedOffers]);

  const handleUnbookmark = async (offerId) => {
    try {
      await api.delete(`/offers/${offerId}/bookmark`);
    } catch (e) {
      // Continue even if API fails (works without database)
    }
    // Remove from local state and stats store
    setOffers(offers.filter(o => o.id !== offerId));
    if (stats.removeBookmarkedOffer) {
      stats.removeBookmarkedOffer(offerId);
    } else {
      stats.setCounts({ ...stats, bookmarks: Math.max(0, (stats.bookmarks || 0) - 1) });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookmarked offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔖 My Bookmarked Offers</h1>
          <p className="text-gray-600 mt-1">{offers.length} offer{offers.length !== 1 ? 's' : ''} bookmarked</p>
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">🔖</div>
          <p className="text-gray-600 text-lg">You haven't bookmarked any offers yet.</p>
          <p className="text-gray-400 text-sm mt-2">Bookmark offers to save them for later!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {offers.map((o) => (
            <div key={o.id} className="relative">
              <OfferCard
                offer={o}
                onLike={async () => {
                  try { await api.post(`/offers/${o.id}/like`); } catch {}
                  stats.addLikedOffer(o);
                }}
                onBookmark={() => handleUnbookmark(o.id)}
                linkState={{ offer: o, shop: o.shop }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



