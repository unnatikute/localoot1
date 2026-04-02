import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ShopsManagement from "../components/AdminShopsTab";
import UsersManagement from "../components/AdminUsersTab";
import AnalyticsTab from "../components/AdminAnalyticsTab";
import { Store, Users, BarChart3, ClipboardCheck, Settings } from "lucide-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("offers");
  const [pendingOffers, setPendingOffers] = useState([]);
  const [rejectingOffer, setRejectingOffer] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [topFiveIds, setTopFiveIds] = useState([]);
  const [approvedOffers, setApprovedOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPending = () => {
    axios
      .get("http://localhost:8080/api/offers/admin/pending")
      .then((res) => setPendingOffers(res.data))
      .catch((err) => console.error("Error fetching pending offers:", err));
  };

  const fetchTopFive = () => {
    axios
      .get("http://localhost:8080/api/offers?sort=top5&limit=5")
      .then((res) => setTopFiveIds(res.data.map((o) => o.id)))
      .catch(() => setTopFiveIds([]));
  };

  const fetchApprovedOffers = () => {
    axios
      .get("http://localhost:8080/api/offers?status=APPROVED")
      .then((res) => setApprovedOffers(res.data || []))
      .catch((err) => {
        console.error("Error fetching approved offers:", err);
        setApprovedOffers([]);
      });
  };

  useEffect(() => {
    fetchPending();
    fetchTopFive();
  }, []);

  useEffect(() => {
    if (activeTab === "top5") {
      fetchApprovedOffers();
      fetchTopFive();
    }
  }, [activeTab]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/offers/admin/approve/${id}`);
      alert("Offer Approved successfully!");
      fetchPending();
    } catch (err) {
      alert("Failed to approve offer.");
    }
  };

  const handleReject = async () => {
    if (!rejectingOffer) return;
    try {
      await axios.put(
        `http://localhost:8080/api/offers/admin/reject/${rejectingOffer.id}`,
        { comment: rejectComment }
      );
      alert("Offer rejected.");
      setRejectingOffer(null);
      setRejectComment("");
      fetchPending();
    } catch (err) {
      alert("Failed to reject offer.");
    }
  };

  const toggleTopFive = (offerId) => {
    setTopFiveIds((prev) => {
      const exists = prev.includes(offerId);
      if (exists) {
        return prev.filter((id) => id !== offerId);
      }
      if (prev.length >= 5) {
        alert("Maximum 5 offers can be selected for Top 5.");
        return prev;
      }
      return [...prev, offerId];
    });
  };

  const saveTopFive = async () => {
    try {
      await axios.put("http://localhost:8080/api/offers/admin/top5", {
        offerIds: topFiveIds,
      });
      alert("Top 5 offers updated successfully!");
      fetchTopFive();
      fetchApprovedOffers();
    } catch (err) {
      alert("Failed to save Top 5 offers.");
    }
  };

  const tabs = [
    {
      id: "offers",
      label: "Pending Offers",
      icon: ClipboardCheck,
      count: pendingOffers.length,
    },
    {
      id: "top5",
      label: "Top 5 Offers",
      icon: ClipboardCheck,
    },
    {
      id: "shops",
      label: "Shops",
      icon: Store,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎛️ Admin Dashboard</h1>
            <p className="text-blue-100">Manage shops, users, offers, and view platform analytics</p>
          </div>
          <Link
            to="/admin/settings"
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-all duration-300 border-b-3 ${
                    activeTab === tab.id
                      ? "border-b-blue-600 text-blue-600 bg-blue-50"
                      : "border-b-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Pending Offers Tab */}
        {activeTab === "offers" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📋 Pending Offers Approval Queue
            </h2>

            {pendingOffers.length === 0 ? (
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center">
                <p className="text-green-700 font-semibold text-lg">
                  ✓ All offers have been approved! No pending items.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border-2 border-gray-200 p-6 rounded-lg shadow-md bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-shadow flex justify-between items-start gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{offer.title}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <p>
                          <strong className="text-gray-600">Shop:</strong>{" "}
                          <span className="text-gray-900">{offer.shopName}</span>
                        </p>
                        <p>
                          <strong className="text-gray-600">Area:</strong>{" "}
                          <span className="text-gray-900">{offer.area}</span>
                        </p>
                        <p>
                          <strong className="text-gray-600">Category:</strong>{" "}
                          <span className="text-gray-900">{offer.category}</span>
                        </p>
                        <p>
                          <strong className="text-gray-600">Contact:</strong>{" "}
                          <span className="text-gray-900">{offer.mobileNumber}</span>
                        </p>
                      </div>
                      <p className="text-gray-600 mt-3 text-sm">
                        <strong>Description:</strong> {offer.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 min-w-fit">
                      <button
                        onClick={() => handleApprove(offer.id)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          setRejectingOffer(offer);
                          setRejectComment("");
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Top 5 Offers Tab */}
        {activeTab === "top5" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ⭐ Configure Top 5 Offers
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select up to 5 approved offers to highlight on the Home page slider. Selected offers will appear first in the trending section.
            </p>
            
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search offers by title, shop name, or category..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={saveTopFive}
                  disabled={topFiveIds.length === 0}
                  className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-all ${
                    topFiveIds.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Save Top 5 ({topFiveIds.length}/5)
                </button>
                {topFiveIds.length > 0 && (
                  <button
                    onClick={() => setTopFiveIds([])}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {topFiveIds.length} of 5 selected
              </span>
            </div>

            {/* Approved Offers List */}
            {approvedOffers.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-lg mb-2">No approved offers found</p>
                <p className="text-gray-500 text-sm">Approve some offers first to configure Top 5</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {approvedOffers
                  .filter((offer) => {
                    if (!searchQuery) return true;
                    const query = searchQuery.toLowerCase();
                    return (
                      offer.title?.toLowerCase().includes(query) ||
                      offer.shopName?.toLowerCase().includes(query) ||
                      offer.category?.toLowerCase().includes(query) ||
                      offer.area?.toLowerCase().includes(query)
                    );
                  })
                  .map((offer) => {
                    const isSelected = topFiveIds.includes(offer.id);
                    return (
                      <div
                        key={offer.id}
                        className={`border-2 rounded-lg p-4 transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleTopFive(offer.id)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                  {offer.title}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                  <span>
                                    <strong>Shop:</strong> {offer.shopName}
                                  </span>
                                  <span>
                                    <strong>Category:</strong> {offer.category}
                                  </span>
                                  <span>
                                    <strong>Area:</strong> {offer.area}
                                  </span>
                                  {offer.discount && (
                                    <span className="text-green-600 font-semibold">
                                      {offer.discount}% OFF
                                    </span>
                                  )}
                                  {offer.price && (
                                    <span className="text-blue-600 font-semibold">
                                      ₹{offer.price}
                                      {offer.originalPrice && (
                                        <span className="text-gray-400 line-through ml-1">
                                          ₹{offer.originalPrice}
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </div>
                                {offer.description && (
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {offer.description}
                                  </p>
                                )}
                                {offer.validFrom && offer.validUntil && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    Valid: {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              {offer.imageUrl && (
                                <img
                                  src={offer.imageUrl}
                                  alt={offer.title}
                                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Shops Tab */}
        {activeTab === "shops" && <ShopsManagement />}

        {/* Users Tab */}
        {activeTab === "users" && <UsersManagement />}

        {/* Analytics Tab */}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>

      {/* Reject Modal */}
      {rejectingOffer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Reject Offer</h3>
            <p className="text-sm text-gray-600 mb-4">
              {rejectingOffer.title} — {rejectingOffer.shopName}
            </p>
            <textarea
              className="w-full border rounded p-2 text-sm mb-4"
              rows={4}
              placeholder="Add a short comment for the shopkeeper (optional)"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setRejectingOffer(null);
                  setRejectComment("");
                }}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded bg-red-600 text-white text-sm font-semibold"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
