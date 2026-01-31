import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Categories from "./pages/Categories.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import OfferDetail from "./pages/OfferDetail.jsx";
import ShopDetail from "./pages/ShopDetail.jsx";
import MyLikes from "./pages/MyLikes.jsx";
import MyBookmarks from "./pages/MyBookmarks.jsx";
import SavedShops from "./pages/SavedShops.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import About from "./pages/About.jsx";

// ADD THESE TWO IMPORTS
import ShopDashboard from "./pages/ShopDashboard.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

import { AuthProvider } from "./store/auth.jsx";
import { StatsProvider } from "./store/stats.jsx";

export default function App() {
  return (
    <AuthProvider>
      <StatsProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
            <Routes>
              <Route path="/" element={<Home />} />

              {/* SHOPKEEPER ROUTE */}
              <Route
                path="/shop-dashboard"
                element={
                  <ProtectedRoute>
                    <ShopDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN ROUTE (Usually kept outside ProtectedRoute or given a special one) */}
              <Route path="/admin-panel" element={<AdminPanel />} />

              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/offers/:offerId"
                element={
                  <ProtectedRoute>
                    <OfferDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shops/:shopId"
                element={
                  <ProtectedRoute>
                    <ShopDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mylikes"
                element={
                  <ProtectedRoute>
                    <MyLikes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mybookmarks"
                element={
                  <ProtectedRoute>
                    <MyBookmarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/savedshops"
                element={
                  <ProtectedRoute>
                    <SavedShops />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* CATCH ALL ROUTE SHOULD BE LAST */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </StatsProvider>
    </AuthProvider>
  );
}
