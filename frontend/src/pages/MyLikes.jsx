import OfferCard from '../components/OfferCard.jsx';
import { useStats } from '../store/stats.jsx';

export default function MyLikes() {
  const { likedOffers } = useStats();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Likes</h1>
      {likedOffers.length === 0 ? (
        <p>You haven't liked any offers yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {likedOffers.map((o) => (
            <OfferCard key={o.id} offer={o} linkState={{ offer: o, shop: o.shop }} />
          ))}
        </div>
      )}
    </div>
  );
}



