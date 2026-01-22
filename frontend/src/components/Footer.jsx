import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">LocalLoot</h3>
            <p className="text-sm">Discover the best local offers and deals in Pune. Your one-stop destination for area-wise offers and discounts.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">My Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/mylikes" className="hover:text-white">My Likes</Link></li>
              <li><Link to="/mybookmarks" className="hover:text-white">My Bookmarks</Link></li>
              <li><Link to="/savedshops" className="hover:text-white">Saved Shops</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@localloot.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Pune, Maharashtra, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LocalLoot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

