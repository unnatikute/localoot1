import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';
import { createApi } from '../api/client.js';

export default function OfferDetail() {
  const { offerId } = useParams();
  const { token } = useAuth();
  const api = useMemo(() => createApi(token), [token]);
  const [offer, setOffer] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    async function load() {
      const fromState = location.state?.offer;
      if (fromState) { setOffer(fromState); return; }
      try {
        const { data } = await api.get(`/offers/${offerId}`);
        if (mounted) setOffer(data);
      } catch {
        // Leave null; could show a message
      }
    }
    load();
    return () => { mounted = false; };
  }, [api, offerId, location.state]);

  if (!offer) return <p>Loading...</p>;

  const shop = offer.shop || offer.shopId;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-lg border p-4">
        {offer.image_url && <img src={offer.image_url} alt={offer.title} className="w-full h-72 object-cover rounded" />}
        <h1 className="mt-4 text-2xl font-bold">{offer.title}</h1>
        <p className="text-gray-700 mt-2">{offer.description}</p>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-2">Shop</h3>
          {offer.shop && (
            <div>
              <div className="flex items-center gap-3">
                {offer.shop.image_url && <img src={offer.shop.image_url} className="w-16 h-16 object-cover rounded" alt={offer.shop.name} />}
                <div>
                  <Link to={`/shops/${offer.shop.id}`} className="text-brand font-medium">{offer.shop.name}</Link>
                  <p className="text-sm text-gray-600">{offer.shop.address}</p>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <p>Phone: {offer.shop.phone || '-'}</p>
                {offer.shop.map_lat && offer.shop.map_lng && (
                  <a className="text-brand" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${offer.shop.map_lat},${offer.shop.map_lng}`}>View on Maps</a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


