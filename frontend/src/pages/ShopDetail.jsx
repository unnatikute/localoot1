import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';
import { createApi } from '../api/client.js';
import { useStats } from '../store/stats.jsx';

export default function ShopDetail() {
  const { shopId } = useParams();
  const location = useLocation();
  const { token } = useAuth();
  const api = useMemo(() => createApi(token), [token]);
  const [shop, setShop] = useState(null);
  const stats = useStats();

  useEffect(() => {
    let mounted = true;
    async function load() {
      const fromState = location.state?.shop;
      if (fromState) { setShop(fromState); return; }
      try {
        const { data } = await api.get(`/shops/${shopId}`);
        if (mounted) setShop(data);
      } catch {
        // ignore for mock flow
      }
    }
    load();
    return () => { mounted = false; };
  }, [api, shopId, location.state]);

  if (!shop) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-start gap-4">
        {shop.image_url && <img src={shop.image_url} className="w-40 h-40 object-cover rounded" alt={shop.name} />}
        <div>
          <h1 className="text-2xl font-bold">{shop.name}</h1>
          <p className="text-gray-700 mt-1">{shop.description}</p>
          <p className="text-sm text-gray-600 mt-2">{shop.address}</p>
          {shop.map_lat && shop.map_lng && (
            <a className="text-brand text-sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${shop.map_lat},${shop.map_lng}`}>Open in Google Maps</a>
          )}
          <div className="mt-3">
            <button onClick={async () => { try { await api.post(`/shops/${shop.id}/save`); } catch {} stats.addSavedShop(shop); }} className="px-3 py-1.5 bg-amber-500 text-white rounded">Save shop</button>
          </div>
        </div>
      </div>
    </div>
  );
}


