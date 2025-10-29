import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../store/auth.jsx';
import { useStats } from '../store/stats.jsx';
import { createApi } from '../api/client.js';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const stats = useStats();

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) { stats.setCounts({ likes: 0, bookmarks: 0, saves: 0 }); return; }
      try {
        const api = createApi(token);
        const { data } = await api.get('/me/nav');
        if (mounted) stats.setCounts(data);
      } catch {}
    }
    load();
    return () => { mounted = false; };
  }, [token]);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand">Localoot</Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-brand">Home</Link>
          <Link to="/contact" className="hover:text-brand">Contact</Link>
          <Link to="/categories" className="hover:text-brand">Categories</Link>
          {user && (
            <>
              <Link to="/mylikes" className="hover:text-brand">My Likes</Link>
              <Link to="/mybookmarks" className="hover:text-brand">My Bookmarks</Link>
              <Link to="/savedshops" className="hover:text-brand">Saved Shops</Link>
            </>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm">
                <span>Likes <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{stats.likes}</span></span>
                <span>Bookmarks <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">{stats.bookmarks}</span></span>
                <span>Saves <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">{stats.saves}</span></span>
              </div>
              <button onClick={() => { logout(); navigate('/'); }} className="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-3 py-1.5 border rounded hover:bg-gray-50">Login</Link>
              <Link to="/signup" className="px-3 py-1.5 bg-brand text-white rounded hover:bg-brand-dark">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}


