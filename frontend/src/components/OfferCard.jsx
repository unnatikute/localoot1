import { Link } from 'react-router-dom';

export default function OfferCard({ offer, onLike, onBookmark, linkState }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      {offer.image_url && (
        <img src={offer.image_url} alt={offer.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{offer.title}</h3>
          {offer.is_trending && <span className="px-2 py-0.5 rounded text-xs bg-rose-100 text-rose-700">Trending</span>}
        </div>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{offer.description}</p>
        <div className="flex items-center gap-2 mt-3">
          <button onClick={onLike} className="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200">Like</button>
          <button onClick={onBookmark} className="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200">Bookmark</button>
          <button onClick={() => {
            if (navigator.share) {
              navigator.share({ title: offer.title, url: window.location.origin + '/offers/' + offer.id });
            } else {
              navigator.clipboard.writeText(window.location.origin + '/offers/' + offer.id);
              alert('Link copied');
            }
          }} className="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200">Share</button>
          <Link to={`/offers/${offer.id}`} state={linkState} className="ml-auto px-3 py-1.5 text-sm bg-brand text-white rounded hover:bg-brand-dark">View</Link>
        </div>
      </div>
    </div>
  );
}


