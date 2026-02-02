import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEYS = {
  LIKED_OFFERS: 'localloot_liked_offers',
  BOOKMARKED_OFFERS: 'localloot_bookmarked_offers',
  SAVED_SHOPS: 'localloot_saved_shops',
};

function loadFromStorage(key, defaultValue = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

const StatsContext = createContext(null);

export function StatsProvider({ children }) {
  const [likedOffers, setLikedOffers] = useState(() =>
    loadFromStorage(STORAGE_KEYS.LIKED_OFFERS)
  );
  const [bookmarkedOffers, setBookmarkedOffers] = useState(() =>
    loadFromStorage(STORAGE_KEYS.BOOKMARKED_OFFERS)
  );
  const [savedShops, setSavedShops] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SAVED_SHOPS)
  );

  const likes = likedOffers.length;
  const bookmarks = bookmarkedOffers.length;
  const saves = savedShops.length;

  // Persist to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LIKED_OFFERS, likedOffers);
  }, [likedOffers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BOOKMARKED_OFFERS, bookmarkedOffers);
  }, [bookmarkedOffers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SAVED_SHOPS, savedShops);
  }, [savedShops]);

  const setCounts = ({ likes: l, bookmarks: b, saves: s }) => {
    // Legacy - no-op, counts are derived from arrays
  };

  const addLikedOffer = (offer) => {
    if (!offer) return;
    setLikedOffers((arr) => {
      if (arr.find((o) => String(o.id) === String(offer.id))) return arr;
      return [offer, ...arr];
    });
  };

  const addBookmarkedOffer = (offer) => {
    if (!offer) return;
    setBookmarkedOffers((arr) => {
      if (arr.find((o) => String(o.id) === String(offer.id))) return arr;
      return [offer, ...arr];
    });
  };

  const addSavedShop = (shop) => {
    if (!shop) return;
    setSavedShops((arr) => {
      if (arr.find((s) => String(s.id) === String(shop.id))) return arr;
      return [shop, ...arr];
    });
  };

  const removeLikedOffer = (offerId) => {
    setLikedOffers((arr) => arr.filter((o) => String(o.id) !== String(offerId)));
  };

  const removeBookmarkedOffer = (offerId) => {
    setBookmarkedOffers((arr) => arr.filter((o) => String(o.id) !== String(offerId)));
  };

  const removeSavedShop = (shopId) => {
    setSavedShops((arr) => arr.filter((s) => String(s.id) !== String(shopId)));
  };

  const isOfferLiked = (offerId) =>
    likedOffers.some((o) => String(o.id) === String(offerId));

  const isOfferBookmarked = (offerId) =>
    bookmarkedOffers.some((o) => String(o.id) === String(offerId));

  const isShopSaved = (shopId) =>
    savedShops.some((s) => String(s.id) === String(shopId));

  return (
    <StatsContext.Provider
      value={{
        likes,
        bookmarks,
        saves,
        likedOffers,
        bookmarkedOffers,
        savedShops,
        setCounts,
        addLikedOffer,
        addBookmarkedOffer,
        addSavedShop,
        removeLikedOffer,
        removeBookmarkedOffer,
        removeSavedShop,
        isOfferLiked,
        isOfferBookmarked,
        isShopSaved,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  return useContext(StatsContext);
}
