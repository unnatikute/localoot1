import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../store/auth.jsx";
import { ShoppingBag, Menu, X, User, LogOut, Settings, LayoutDashboard, Store, Crown, ChevronDown } from "lucide-react";
import { isAdmin, isShopkeeper, getRoleFromUser } from "../utils/roles.js";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);

  const userIsAdmin = isAdmin(user);
  const userIsShopkeeper = isShopkeeper(user);
  const userRole = getRoleFromUser(user);

  // State to toggle the dropdown visibility
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case "ADMIN":
        return { text: "Admin", icon: Crown, color: "from-purple-500 to-pink-500", bgColor: "bg-purple-100 text-purple-800" };
      case "SHOPKEEPER":
        return { text: "Shopkeeper", icon: Store, color: "from-green-500 to-emerald-600", bgColor: "bg-green-100 text-green-800" };
      default:
        return { text: "User", icon: User, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-100 text-blue-800" };
    }
  };

  const roleBadge = user ? getRoleBadge() : null;
  const RoleIcon = roleBadge?.icon || User;

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
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-white font-semibold hover:text-yellow-300 transition py-2">
                    🏠 Home
                  </Link>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-white font-semibold hover:text-yellow-300 transition py-2">
                    ℹ️ About
                  </Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-white font-semibold hover:text-yellow-300 transition py-2">
                    📞 Contact
                  </Link>
                  <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="block text-white font-semibold hover:text-yellow-300 transition py-2">
                    📂 Categories
                  </Link>
                </div>

                {/* User Section */}
                {user ? (
                  <div className="border-t border-blue-500 pt-4 space-y-3">
                    {/* User Profile Card */}
                    <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${roleBadge?.color || "from-blue-500 to-indigo-600"} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-bold text-lg">{user.name}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${roleBadge?.bgColor || "bg-blue-100 text-blue-800"}`}>
                            {roleBadge?.text || "User"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Role-based Quick Links */}
                    {userIsAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold transition text-center shadow-lg"
                      >
                        ⭐ Admin Panel
                      </Link>
                    )}
                    {userIsShopkeeper && (
                      <Link
                        to="/shop-dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold transition text-center shadow-lg"
                      >
                        🏪 Shop Dashboard
                      </Link>
                    )}
                    {(!userIsAdmin || !userIsShopkeeper) && (
                      <>
                        {!userIsAdmin && !userIsShopkeeper && (
                          <>
                            <Link
                              to="/mybookmarks"
                              onClick={() => setMobileMenuOpen(false)}
                              className="block w-full px-4 py-3 bg-white bg-opacity-20 text-white border-2 border-white rounded-lg hover:bg-opacity-30 font-semibold transition text-center"
                            >
                              💾 My Bookmarks
                            </Link>
                            <Link
                              to="/mylikes"
                              onClick={() => setMobileMenuOpen(false)}
                              className="block w-full px-4 py-3 bg-white bg-opacity-20 text-white border-2 border-white rounded-lg hover:bg-opacity-30 font-semibold transition text-center"
                            >
                              ❤️ My Likes
                            </Link>
                          </>
                        )}
                        <Link
                          to="/savedshops"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block w-full px-4 py-3 bg-white bg-opacity-20 text-white border-2 border-white rounded-lg hover:bg-opacity-30 font-semibold transition text-center"
                        >
                          🏪 Saved Shops
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition shadow-md"
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
          <div className="hidden md:flex items-center gap-6">
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
                {/* Role-based Quick Access Buttons */}
                {userIsAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                {userIsShopkeeper && (
                  <Link
                    to="/shop-dashboard"
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-bold transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <Store className="w-4 h-4" />
                    Shop Dashboard
                  </Link>
                )}

                {/* User Profile Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition duration-200 backdrop-blur-sm border border-white border-opacity-30"
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${roleBadge?.color || "from-blue-500 to-indigo-600"} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-white font-semibold text-sm">{user.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge?.bgColor || "bg-blue-100 text-blue-800"}`}>
                        {roleBadge?.text || "User"}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border-2 border-gray-200 animate-in fade-in slide-in-from-top-2">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${roleBadge?.color || "from-blue-500 to-indigo-600"} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${roleBadge?.bgColor || "bg-blue-100 text-blue-800"}`}>
                              {roleBadge?.text || "User"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div className="py-2">
                        {!userIsAdmin && !userIsShopkeeper && (
                          <>
                            <Link
                              to="/mybookmarks"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                            >
                              <User className="w-4 h-4" />
                              My Bookmarks
                            </Link>
                            <Link
                              to="/mylikes"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                            >
                              <User className="w-4 h-4" />
                              My Likes
                            </Link>
                            <Link
                              to="/savedshops"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                            >
                              <Store className="w-4 h-4" />
                              Saved Shops
                            </Link>
                          </>
                        )}
                        {(userIsAdmin || userIsShopkeeper) && (
                          <Link
                            to="/savedshops"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                          >
                            <Store className="w-4 h-4" />
                            Saved Shops
                          </Link>
                        )}
                        {userIsAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        {userIsShopkeeper && (
                          <Link
                            to="/shop-dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Shop Dashboard
                          </Link>
                        )}
                        <Link
                          to="/categories"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Browse Offers
                        </Link>
                      </div>

                      {/* Divider */}
                      <hr className="my-2" />

                      {/* Settings & Logout */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            // TODO: Navigate to settings page when implemented
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition w-full text-left"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-from-top-2 {
          from {
            transform: translateY(-8px);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fade-in 0.2s ease-out, slide-in-from-top-2 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
