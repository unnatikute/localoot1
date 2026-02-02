import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Categories from "./pages/Categories.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import OfferDetail from "./pages/OfferDetail.jsx";
import ShopDetail from "./pages/ShopDetail.jsx";

import MyLikes from "./pages/MyLikes.jsx";
import MyBookmarks from "./pages/MyBookmarks.jsx";
import SavedShops from "./pages/SavedShops.jsx";

import ShopDashboard from "./pages/ShopDashboard.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminUserDetails from "./pages/AdminUserDetails.jsx";
import AdminShopDetails from "./pages/AdminShopDetails.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./store/auth.jsx";
import { StatsProvider } from "./store/stats.jsx";

export default function App() {
  return (
    <AuthProvider>
      <StatsProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />

          <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
            <Routes>
              {/* PUBLIC */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* USER */}
              <Route
                path="/categories"
                element={
                  <ProtectedRoute allowedRoles={["USER", "SHOPKEEPER", "ADMIN"]}>
                    <Categories />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/offers/:offerId"
                element={
                  <ProtectedRoute allowedRoles={["USER", "SHOPKEEPER", "ADMIN"]}>
                    <OfferDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/shops/:shopId"
                element={
                  <ProtectedRoute allowedRoles={["USER", "SHOPKEEPER", "ADMIN"]}>
                    <ShopDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mylikes"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <MyLikes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mybookmarks"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <MyBookmarks />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/savedshops"
                element={
                  <ProtectedRoute allowedRoles={["USER", "SHOPKEEPER", "ADMIN"]}>
                    <SavedShops />
                  </ProtectedRoute>
                }
              />

              {/* SHOP OWNER */}
              <Route
                path="/shop-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["SHOPKEEPER"]}>
                    <ShopDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users/:id"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminUserDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/shops/:id"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminShopDetails />
                  </ProtectedRoute>
                }
              />

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </StatsProvider>
    </AuthProvider>
  );
}
