import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/auth.jsx';
import { createApi } from '../api/client.js';
import OfferCard from '../components/OfferCard.jsx';
import OfferQRCode from '../components/OfferQRCode.jsx';
import { useStats } from '../store/stats.jsx';
import { Bookmark, Sparkles, Heart } from 'lucide-react';

export default function MyBookmarks() {
  const { token } = useAuth();
  const api = useMemo(() => createApi(token), [token]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const stats = useStats();

  // Get user info for QR codes
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
    setOffers((prev) => prev.filter((o) => String(o.id) !== String(offerId)));
    stats.removeBookmarkedOffer(offerId);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-12"
      >
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative mx-auto mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bookmark className="h-8 w-8 text-white animate-pulse" />
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full -z-10"
            />
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 font-medium"
          >
            Loading your bookmarked offers...
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full origin-left"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center justify-between bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-2xl border border-gradient-to-r from-blue-100 to-purple-100 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
          >
            <Bookmark className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              My Bookmarked Offers
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 mt-2 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-yellow-500" />
              {offers.length} offer{offers.length !== 1 ? 's' : ''} saved for you
            </motion.p>
          </div>
        </div>
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="hidden md:flex items-center gap-2 text-sm text-gray-500"
        >
          <Heart className="h-4 w-4 text-red-400" />
          <span>Keep exploring!</span>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {offers.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-xl border border-gray-200"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl mb-6"
            >
              🔖
            </motion.div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-xl font-medium mb-2"
            >
              Your bookmark collection is empty
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm"
            >
              Start exploring amazing offers and save your favorites!
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="mt-6 flex justify-center"
            >
              <div className="flex gap-2">
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0
                  }}
                  className="w-3 h-3 bg-blue-400 rounded-full"
                />
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.2
                  }}
                  className="w-3 h-3 bg-purple-400 rounded-full"
                />
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.4
                  }}
                  className="w-3 h-3 bg-pink-400 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="offers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {offers.map((o, index) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative">
                  <OfferCard
                    offer={o}
                    onLike={async () => {
                      try { await api.post(`/offers/${o.id}/like`); } catch {}
                      stats.addLikedOffer(o);
                    }}
                    onBookmark={() => handleUnbookmark(o.id)}
                    linkState={{ offer: o, shop: o.shop }}
                  />
                  {/* Enhanced QR Code section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="mt-4 flex justify-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                    >
                      <OfferQRCode
                        offerId={o.id}
                        userId={user?.id}
                        offerTitle={o.title}
                        shopName={o.shopName}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



