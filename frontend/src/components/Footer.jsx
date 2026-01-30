import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 mt-12 md:mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 md:mb-3">
              Local<span className="text-yellow-300">Loot</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-3">
              Discover the best local offers and deals in your area. Your one-stop destination for authentic local businesses and amazing discounts.
            </p>
            <div className="flex gap-3 mb-3 md:mb-0">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition transform hover:scale-110">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="bg-sky-500 hover:bg-sky-600 p-2 rounded-lg transition transform hover:scale-110">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded-lg transition transform hover:scale-110">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg transition transform hover:scale-110">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
              <span className="text-blue-400">🔗</span> Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-yellow-300 transition font-medium">
                  → Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-yellow-300 transition font-medium">
                  → Categories
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-yellow-300 transition font-medium">
                  → Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-yellow-300 transition font-medium">
                  → About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
              <span className="text-purple-400">👤</span> My Account
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mylikes" className="text-gray-400 hover:text-yellow-300 transition font-medium">
                  ❤️ My Likes
                </Link>
              </li>
              <li>
                <Link to="/mybookmarks" className="text-gray-400 hover:text-yellow-300 transition font-medium">
                  🔖 My Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/savedshops" className="text-gray-400 hover:text-yellow-300 transition font-medium">
                  🏪 Saved Shops
                </Link>
              </li>
              <li>
                <Link to="/shop-dashboard" className="text-gray-400 hover:text-yellow-300 transition font-medium">
                  📊 Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
              <span className="text-green-400">📞</span> Connect With Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href="mailto:support@localloot.com" className="text-gray-300 hover:text-yellow-300 transition font-medium">
                    support@localloot.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a href="tel:+919876543210" className="text-gray-300 hover:text-yellow-300 transition font-medium">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-gray-300 font-medium">Pune, Maharashtra, India</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
              <span className="text-red-400">📧</span> Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-3">Subscribe to get exclusive deals and updates!</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition text-sm"
              />
              <button className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-500 transition shadow-lg hover:shadow-xl text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-4 md:pt-6">

          {/* Copyright */}
          <div className="text-center pt-4 md:pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-2">
              © {currentYear} <span className="font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">LocalLoot</span>. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs flex items-center justify-center gap-1 flex-wrap">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Pune, India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

