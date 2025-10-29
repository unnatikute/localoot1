import OfferCard from '../components/OfferCard.jsx';
import { useStats } from '../store/stats.jsx';

export default function MyBookmarks() {
  const { bookmarkedOffers } = useStats();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>
      {bookmarkedOffers.length === 0 ? (
        <p>You haven't bookmarked any offers yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {bookmarkedOffers.map((o) => (
            <OfferCard key={o.id} offer={o} linkState={{ offer: o, shop: o.shop }} />
          ))}
        </div>
      )}
    </div>
  );
}



