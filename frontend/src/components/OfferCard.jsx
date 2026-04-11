import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStats } from '../store/stats.jsx';
import { Heart, Bookmark as BookmarkIcon, Share2, Eye, Clock, MapPin, Store } from 'lucide-react';

export default function OfferCard({ offer, onLike, onBookmark, linkState, isLiked, isBookmarked }) {
  const stats = useStats();
  const liked = isLiked ?? (offer?.id && stats?.isOfferLiked?.(offer.id));
  const bookmarked = isBookmarked ?? (offer?.id && stats?.isOfferBookmarked?.(offer.id));

  const formatDuration = (ms) => {
    if (ms <= 0) return "Expired";
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const timeLeft = (() => {
    if (!offer?.validUntil || offer.status !== "APPROVED") return null;
    const now = new Date();
    const until = new Date(offer.validUntil);
    const diff = until - now;
    if (diff <= 0) return "Expired";
    return formatDuration(diff);
  })();

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/offers/${offer.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: offer.title,
          text: offer.description || offer.title,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.();
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.();
  };

  return (
    <motion.div
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 flex flex-col group relative"
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>

      {offer.image_url && (
        <motion.div
          className="relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={offer.image_url}
            alt={offer.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {offer.is_trending && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg flex items-center gap-1"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥
              </motion.div>
              Trending
            </motion.span>
          )}
        </motion.div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <motion.h3
            className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {offer.title}
          </motion.h3>

          <motion.p
            className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed"
            whileHover={{ scale: 1.01 }}
          >
            {offer.description || 'No description available.'}
          </motion.p>

          {offer.shop && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-semibold text-blue-700">
                  Pune: {offer.shop.area?.name || offer.shop.area || 'Pune'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-purple-600" />
                <p className="text-xs text-gray-600">{offer.shop.name}</p>
              </div>
            </motion.div>
          )}

          {(offer.validFrom || offer.validUntil) && (
            <motion.div
              className="mb-3 text-xs text-gray-500 flex items-center gap-1"
              whileHover={{ scale: 1.01 }}
            >
              <Clock className="h-3 w-3" />
              {offer.validFrom && offer.validUntil && (
                <span>{new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}</span>
              )}
              {!offer.validFrom && offer.validUntil && (
                <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
              )}
              {offer.validFrom && !offer.validUntil && (
                <span>Valid from {new Date(offer.validFrom).toLocaleDateString()}</span>
              )}
            </motion.div>
          )}

          {timeLeft && (
            <motion.div
              className="mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                timeLeft === 'Expired'
                  ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300'
                  : 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300'
              }`}>
                {timeLeft === 'Expired' ? '⏰ Expired' : `⏳ Ends in ${timeLeft}`}
              </span>
            </motion.div>
          )}

          {(offer.discount || offer.price) && (
            <motion.div
              className="mb-4 flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              {offer.discount && (
                <motion.span
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {offer.discount}% OFF
                </motion.span>
              )}
              {offer.price && (
                <div className="flex items-center gap-2">
                  <motion.span
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    ₹{offer.price}
                  </motion.span>
                  {offer.originalPrice && offer.originalPrice > offer.price && (
                    <motion.span
                      className="text-sm text-gray-400 line-through"
                      whileHover={{ x: -2 }}
                    >
                      ₹{offer.originalPrice}
                    </motion.span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 px-4 py-3 text-sm rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              liked
                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-2 border-red-300 shadow-md'
                : 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:bg-red-200 hover:shadow-md'
            }`}
          >
            <motion.div
              animate={liked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            </motion.div>
            {liked ? 'Liked' : 'Like'}
          </motion.button>

          <motion.button
            onClick={handleBookmark}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 px-4 py-3 text-sm rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              bookmarked
                ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border-2 border-yellow-300 shadow-md'
                : 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:shadow-md'
            }`}
          >
            <motion.div
              animate={bookmarked ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <BookmarkIcon className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
            </motion.div>
            {bookmarked ? 'Saved' : 'Save'}
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:bg-blue-200 font-medium transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Link
              to={`/offers/${offer.id}`}
              state={linkState}
              className="block px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-300 text-center shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
