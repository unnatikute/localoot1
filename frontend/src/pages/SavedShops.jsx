import { Link } from 'react-router-dom';
import { useStats } from '../store/stats.jsx';

export default function SavedShops() {
  const { savedShops } = useStats();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Saved Shops</h1>
      {savedShops.length === 0 ? (
        <p>You haven't saved any shops yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {savedShops.map((s) => (
            <div key={s.id} className="bg-white border rounded-lg overflow-hidden">
              {s.image_url && <img src={s.image_url} alt={s.name} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-sm text-gray-600">{s.address}</p>
                <Link to={`/shops/${s.id}`} state={{ shop: s }} className="inline-block mt-2 text-brand text-sm">View shop</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



