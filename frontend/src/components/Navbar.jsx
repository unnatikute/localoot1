import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth.jsx";
import { useStats } from "../store/stats.jsx";
import { createApi } from "../api/client.js";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const stats = useStats();

  // State to toggle the dropdown visibility
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand">
          LocalLoot
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-brand">
            Home
          </Link>
          <Link to="/contact" className="hover:text-brand">
            Contact
          </Link>
          <Link to="/categories" className="hover:text-brand">
            Categories
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Hi, {user.name}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* LOGIN DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLoginOptions(!showLoginOptions);
                    setShowSignupOptions(false);
                  }}
                  className="px-3 py-1.5 border rounded hover:bg-gray-50 flex items-center gap-1"
                >
                  Login ▾
                </button>

                {showLoginOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/login?role=user"
                      onClick={() => setShowLoginOptions(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      User
                    </Link>
                    <Link
                      to="/login?role=shopkeeper"
                      onClick={() => setShowLoginOptions(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Shopkeeper
                    </Link>
                    <Link
                      to="/login?role=admin"
                      onClick={() => setShowLoginOptions(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 text-brand font-bold"
                    >
                      Admin
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
                  className="px-3 py-1.5 bg-brand text-white rounded hover:bg-brand-dark flex items-center gap-1"
                >
                  Sign up ▾
                </button>

                {showSignupOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/signup?role=user"
                      onClick={() => setShowSignupOptions(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      User
                    </Link>
                    <Link
                      to="/signup?role=shopkeeper"
                      onClick={() => setShowSignupOptions(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Shopkeeper
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
  );
}
