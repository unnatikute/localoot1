import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth.jsx";
import { useStats } from "../store/stats.jsx";
import { createApi } from "../api/client.js";
import { ShoppingBag, Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const stats = useStats();

  // State to toggle the dropdown visibility
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-white rounded-lg p-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <ShoppingBag className="w-6 h-6 text-blue-600 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="text-3xl font-bold text-white drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-300">
              Local<span className="text-yellow-300 group-hover:text-yellow-200 transition-colors">Loot</span>
            </span>
          </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-blue-600 to-indigo-700 shadow-xl border-t border-blue-500">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-3">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white font-semibold hover:text-yellow-300 transition py-2"
                >
                  🏠 Home
                </Link>

                 <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white font-semibold hover:text-yellow-300 transition py-2"
                >
                  ℹ️ About
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white font-semibold hover:text-yellow-300 transition py-2"
                >
                  📞 Contact
                </Link>
              
                <Link
                  to="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white font-semibold hover:text-yellow-300 transition py-2"
                >
                  📂 Categories
                </Link>
              </div>

              {/* User Section */}
              {user ? (
                <div className="border-t border-blue-500 pt-4 space-y-3">
                  <div className="text-white">
                    <span className="text-sm font-semibold">Welcome,</span>
                    <p className="text-yellow-300 font-bold">{user.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-blue-500 pt-4 space-y-3">
                  {/* Mobile Login Options */}
                  <div className="space-y-2">
                    <Link
                      to="/login?role=user"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-white bg-opacity-20 text-white border-2 border-white rounded-lg hover:bg-opacity-30 font-semibold transition text-center"
                    >
                      👤 User Login
                    </Link>
                    <Link
                      to="/login?role=shopkeeper"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-white bg-opacity-20 text-white border-2 border-white rounded-lg hover:bg-opacity-30 font-semibold transition text-center"
                    >
                      🏪 Shopkeeper Login
                    </Link>
                    <Link
                      to="/login?role=admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold transition text-center"
                    >
                      ⭐ Admin Access
                    </Link>
                  </div>

                  {/* Mobile Signup Options */}
                  <div className="space-y-2">
                    <Link
                      to="/signup?role=user"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-orange-500 font-bold transition text-center"
                    >
                      👤 Sign up as User
                    </Link>
                    <Link
                      to="/signup?role=shopkeeper"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-orange-500 font-bold transition text-center"
                    >
                      🏪 Sign up as Shopkeeper
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-white font-semibold hover:text-yellow-300 transition duration-200 relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </Link>
            <Link to="/about" className="text-white font-semibold hover:text-yellow-300 transition duration-200 relative group">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/contact" className="text-white font-semibold hover:text-yellow-300 transition duration-200 relative group">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </Link>
        
          <Link to="/categories" className="text-white font-semibold hover:text-yellow-300 transition duration-200 relative group">
            Categories
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-white">
                <span className="text-sm font-semibold">Welcome,</span>
                <p className="text-yellow-300 font-bold">{user.name}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* LOGIN DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLoginOptions(!showLoginOptions);
                    setShowSignupOptions(false);
                  }}
                  className="px-4 py-2 bg-white bg-opacity-20 text-white border-2 border-white rounded-lg hover:bg-opacity-30 font-semibold flex items-center gap-1 transition duration-200 backdrop-blur-sm"
                >
                  Login ▾
                </button>

                {showLoginOptions && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border-2 border-blue-200 animate-in fade-in slide-in-from-top-2">
                    <Link
                      to="/login?role=user"
                      onClick={() => setShowLoginOptions(false)}
                      className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      👤 User Login
                    </Link>
                    <Link
                      to="/login?role=shopkeeper"
                      onClick={() => setShowLoginOptions(false)}
                      className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    >
                      🏪 Shopkeeper Login
                    </Link>
                    <hr className="my-2" />
                    <Link
                      to="/login?role=admin"
                      onClick={() => setShowLoginOptions(false)}
                      className="block px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition"
                    >
                      ⭐ Admin Access
                    </Link>
                  </div>
                )}
              </div>

              {/* SIGNUP DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSignupOptions(!showSignupOptions);
                    setShowLoginOptions(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-orange-500 font-bold flex items-center gap-1 transition duration-200 shadow-md hover:shadow-lg"
                >
                  Sign up ▾
                </button>

                {showSignupOptions && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border-2 border-orange-200 animate-in fade-in slide-in-from-top-2">
                    <Link
                      to="/signup?role=user"
                      onClick={() => setShowSignupOptions(false)}
                      className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      👤 Sign up as User
                    </Link>
                    <Link
                      to="/signup?role=shopkeeper"
                      onClick={() => setShowSignupOptions(false)}
                      className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      🏪 Sign up as Shopkeeper
                    </Link>
                    {/* Note: Admin signup is hidden per your requirement */}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>

    <style jsx>{`
      @keyframes slide-down {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-slide-down {
        animation: slide-down 0.4s ease-out;
      }
    `}</style>
    </>
  );
}
