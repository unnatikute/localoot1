import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ShopAnalytics from "../components/ShopAnalytics";
import QRScanner from "../components/QRScanner";
import { BarChart3, QrCode, TrendingUp } from "lucide-react";
import { isShopkeeper } from "../utils/roles.js";

const ShopDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [shop, setShop] = useState(null);
  const [activeTab, setActiveTab] = useState('offers');
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [loadingShop, setLoadingShop] = useState(false);
  const [error, setError] = useState(null);

  // Get logged-in user details
  const user = JSON.parse(localStorage.getItem("user"));
  const isShopkeeperRole = isShopkeeper(user);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    validFrom: "",
    validUntil: "",
    shopkeeper: { id: user?.id },
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [scannedQRs, setScannedQRs] = useState(new Set());

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setBannerPreview(null);
    }
  };

  const handleQRScanSuccess = (scanData) => {
    const qrKey = `${scanData.offerId}-${scanData.userId}`;
    
    if (scannedQRs.has(qrKey)) {
      alert('This QR code has already been scanned and cannot be scanned again.');
      return;
    }
    
    setScannedQRs(prev => new Set([...prev, qrKey]));
    alert(`Visit recorded! User visited for offer ${scanData.offerId}`);
    // You could also refresh analytics here
  };
  const pendingOffers = offers.filter((offer) => offer.status !== 'APPROVED');

  // Fetch shop & offers
  useEffect(() => {
    if (user?.id) {
      setLoadingOffers(true);
      setLoadingShop(true);
      setError(null);

      axios
        .get(`http://localhost:8080/api/offers/shopkeeper/${user.id}?all=true`)
        .then((res) => setOffers(Array.isArray(res.data) ? res.data : []))
        .catch((err) => {
          console.error('Failed to load offers', err);
          setError('Unable to load offers.');
        })
        .finally(() => setLoadingOffers(false));

      axios
        .get(`http://localhost:8080/api/shops/my-shop?shopkeeperId=${user.id}`)
        .then((res) => setShop(res.data))
        .catch((err) => {
          console.error('Failed to load shop', err);
          setError('Unable to load shop details.');
        })
        .finally(() => setLoadingShop(false));
    }
  }, [user?.id]);

  const getValidityLabel = (offer) => {
    const now = new Date();
    const from = offer.validFrom ? new Date(offer.validFrom) : null;
    const until = offer.validUntil ? new Date(offer.validUntil) : null;

    if (offer.status !== "APPROVED") return null;
    if (from && now < from) return `Starts from ${from.toLocaleString()}`;
    if (until) {
      if (now > until) return "Expired";
      const diffMs = until - now;
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      return `Active for ${days}d ${hours}h more`;
    }
    return "Active";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return alert("User not logged in");

    try {
      const now = new Date();
      const fromDate = formData.validFrom ? new Date(formData.validFrom) : now;
      const untilDate = formData.validUntil ? new Date(formData.validUntil) : null;

      if (untilDate && fromDate > untilDate) {
        alert("End date must be after start date");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      const finalCategory = formData.category || shop?.category || '';
      formDataToSend.append('category', finalCategory);
      formDataToSend.append('price', formData.price ? parseFloat(formData.price) : '');
      formDataToSend.append('discount', formData.discount ? parseInt(formData.discount, 10) : '');
      formDataToSend.append('validFrom', fromDate ? fromDate.toISOString().slice(0, 19) : '');
      formDataToSend.append('validUntil', untilDate ? untilDate.toISOString().slice(0, 19) : '');
      formDataToSend.append('shopkeeper', JSON.stringify({ id: user.id }));

      if (bannerFile) {
        formDataToSend.append('banner', bannerFile);
      }

      await axios.post("http://localhost:8080/api/offers/create", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Offer submitted successfully!");
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        discount: "",
        validFrom: "",
        validUntil: "",
        shopkeeper: { id: user?.id },
      });
      setBannerFile(null);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error submitting offer. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Shop Dashboard</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">{shop?.name || 'Your Shop'} Overview</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Manage offers, view shop details, and monitor customer engagement from one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-full border transition ${activeTab === 'offers' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-gray-300 hover:bg-slate-50'}`}
          >
            Offers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-full border transition ${activeTab === 'analytics' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-gray-300 hover:bg-slate-50'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-4 py-2 rounded-full border transition ${activeTab === 'qr' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-gray-300 hover:bg-slate-50'}`}
          >
            QR Scanner
          </button>
          <button
            onClick={() => {
              setActiveTab('offers');
              setShowForm((prev) => !prev);
            }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-lg shadow-sky-200/30 hover:brightness-105 transition"
          >
            {showForm ? 'Close Form' : 'Add Offer'}
          </button>
        </div>
      </div>

      {(loadingShop || loadingOffers) && (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="text-gray-600">Loading shop dashboard...</p>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loadingShop && shop && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Shop Name</p>
            <p className="text-xl font-semibold text-slate-900 mt-2">{shop.name || 'N/A'}</p>
            <p className="mt-3 text-sm text-gray-600">{shop.description || 'Your shop description will appear here.'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-xl font-semibold text-slate-900 mt-2">{shop.area || shop.city || 'Location not set'}</p>
            <p className="mt-3 text-sm text-gray-600">{shop.address || 'Address not available'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Quick Stats</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total Offers</p>
                <p className="text-2xl font-semibold text-slate-900">{offers.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-emerald-600">{activeOffers.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-amber-600">{pendingOffers.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Create New Offer</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Title</span>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Category</span>
                <input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500"
                rows={4}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Banner/Pamphlet</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {bannerFile && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600">Selected: {bannerFile.name}</p>
                  {bannerPreview && (
                    <div className="relative inline-block">
                      <img 
                        src={bannerPreview} 
                        alt="Banner preview" 
                        className="max-w-xs max-h-48 rounded-lg border border-gray-300 shadow-sm" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBannerFile(null);
                          setBannerPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Price</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Discount (%)</span>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Valid Until</span>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </label>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
              <button
                type="submit"
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                Submit Offer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    price: "",
                    discount: "",
                    validFrom: "",
                    validUntil: "",
                    shopkeeper: { id: user?.id },
                  });
                  setBannerFile(null);
                  setBannerPreview(null);
                }}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Your Offers</h2>
                <p className="mt-1 text-sm text-gray-500">Review all offers created for your shop.</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-full bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700 transition"
              >
                Create New Offer
              </button>
            </div>

            {loadingOffers ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                Loading offers...
              </div>
            ) : offers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-gray-600">
                No offers found yet. Use the button above to add your first offer.
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{offer.category || 'Category'}</p>
                        <h3 className="text-xl font-semibold text-slate-900">{offer.title || 'Untitled Offer'}</h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{offer.description || 'No description available.'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{offer.status || 'Draft'}</span>
                        {offer.discount ? (
                          <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700">{offer.discount}% off</span>
                        ) : null}
                        {offer.price ? (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">₹{offer.price}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-white p-4 border border-slate-200">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Valid</p>
                        <p className="mt-2 text-sm text-slate-700">{getValidityLabel(offer) || 'Not active'}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 border border-slate-200">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Shop</p>
                        <p className="mt-2 text-sm text-slate-700">{offer.shopName || shop?.name || 'Your Shop'}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 border border-slate-200">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Posted</p>
                        <p className="mt-2 text-sm text-slate-700">{offer.validFrom ? new Date(offer.validFrom).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <ShopAnalytics shopkeeperId={user?.id} />
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-2xl font-semibold text-slate-900">QR Scan Manager</h2>
              <p className="mt-2 text-sm text-gray-600">Scan customer visits and record offer use from the shop floor.</p>
            </div>
            <QRScanner shopkeeperId={user?.id} onScanSuccess={handleQRScanSuccess} scannedQRs={scannedQRs} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDashboard;