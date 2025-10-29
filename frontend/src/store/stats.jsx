import React, { createContext, useContext, useState } from 'react';

const StatsContext = createContext(null);

export function StatsProvider({ children }) {
  const [likes, setLikes] = useState(0);
  const [bookmarks, setBookmarks] = useState(0);
  const [saves, setSaves] = useState(0);
  const [likedOffers, setLikedOffers] = useState([]);
  const [bookmarkedOffers, setBookmarkedOffers] = useState([]);
  const [savedShops, setSavedShops] = useState([]);

  const setCounts = ({ likes: l = 0, bookmarks: b = 0, saves: s = 0 }) => {
    setLikes(l);
    setBookmarks(b);
    setSaves(s);
  };

  const incLikes = (delta = 1) => setLikes((v) => v + delta);
  const incBookmarks = (delta = 1) => setBookmarks((v) => v + delta);
  const incSaves = (delta = 1) => setSaves((v) => v + delta);

  const addLikedOffer = (offer) => {
    setLikedOffers((arr) => {
      if (arr.find((o) => String(o.id) === String(offer.id))) return arr;
      return [offer, ...arr];
    });
    incLikes(1);
  };

  const addBookmarkedOffer = (offer) => {
    setBookmarkedOffers((arr) => {
      if (arr.find((o) => String(o.id) === String(offer.id))) return arr;
      return [offer, ...arr];
    });
    incBookmarks(1);
  };

  const addSavedShop = (shop) => {
    setSavedShops((arr) => {
      if (arr.find((s) => String(s.id) === String(shop.id))) return arr;
      return [shop, ...arr];
    });
    incSaves(1);
  };

  return (
    <StatsContext.Provider value={{ likes, bookmarks, saves, likedOffers, bookmarkedOffers, savedShops, setCounts, incLikes, incBookmarks, incSaves, addLikedOffer, addBookmarkedOffer, addSavedShop }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  return useContext(StatsContext);
}


