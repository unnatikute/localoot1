import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminAnalytics from "../components/AdminAnalytics";
import { BarChart3, Award, Settings } from "lucide-react";

const AdminPanel = () => {
  const [approvedOffers, setApprovedOffers] = useState([]);
  const [topFiveIds, setTopFiveIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopPlans, setShopPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('offers');

  // ✅ FETCH APPROVED OFFERS (WITH PLAN)
  const fetchApprovedOffers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/offers/admin/approved-with-plan"
      );
      setApprovedOffers(res.data || []);
    } catch (err) {
      console.error(err);
      setApprovedOffers([]);
    }
  };

  // ✅ FETCH TOP 5
  const fetchTopFive = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/offers/top5"
      );

      if (Array.isArray(res.data)) {
        setTopFiveIds(res.data.map((o) => o.id));
      }
    } catch {
      setTopFiveIds([]);
    }
  };

  useEffect(() => {
    fetchApprovedOffers();
    fetchTopFive();
  }, []);

  // ✅ TOGGLE LOGIC (PLAN BASED)
  const toggleTopFive = (offer) => {
    const offerId = offer.id;

    setTopFiveIds((prev) => {
      const isSelected = prev.includes(offerId);

      // REMOVE
      if (isSelected) {
        return prev.filter((id) => id !== offerId);
      }

      // GLOBAL LIMIT
      if (prev.length >= 5) {
        alert("Only 5 offers allowed globally");
        return prev;
      }

      // PLAN FROM API ✅
      const plan = offer.shopPlan || "Basic";

      const planLimit =
        plan === "Premium" ? 5 :
        plan === "Standard" ? 3 : 1;

      const shopSelectedCount = prev.filter((id) => {
        const o = approvedOffers.find((x) => x.id === id);
        return o?.shopId === offer.shopId;
      }).length;

      if (shopSelectedCount >= planLimit) {
        alert(`❌ ${plan} allows only ${planLimit} top offers`);
        return prev;
      }

      return [...prev, offerId];
    });
  };

  // ✅ SAVE
  const saveTopFive = async () => {
    try {
      await axios.put(
        "http://localhost:8080/api/offers/admin/top5",
        { offerIds: topFiveIds }
      );

      alert("✅ Saved successfully");
      fetchTopFive();
    } catch {
      alert("❌ Save failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'offers'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Award className="h-4 w-4" />
          Top Offers
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'offers' && (
        <>
          <h2 className="text-2xl font-bold mb-6">
            ⭐ Top 5 Offers (Plan Based)
          </h2>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search offers..."
            className="w-full p-3 border rounded mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* ACTIONS */}
          <div className="flex justify-between mb-4">
            <button
              onClick={saveTopFive}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Save ({topFiveIds.length}/5)
            </button>

            <button
              onClick={() => setTopFiveIds([])}
              className="px-4 py-2 border rounded"
            >
              Clear
            </button>
          </div>

          {/* OFFERS */}
          <div className="space-y-3">
            {approvedOffers
              .filter((offer) => {
                if (!searchQuery) return true;

                const q = searchQuery.toLowerCase();
                return (
                  offer.title?.toLowerCase().includes(q) ||
                  offer.shopName?.toLowerCase().includes(q)
                );
              })
              .map((offer) => {
                const isSelected = topFiveIds.includes(offer.id);

                const plan = offer.shopPlan || "Basic";

                const planLimit =
                  plan === "Premium" ? 5 :
                  plan === "Standard" ? 3 : 1;

                const shopSelectedCount = topFiveIds.filter((id) => {
                  const o = approvedOffers.find((x) => x.id === id);
                  return o?.shopId === offer.shopId;
                }).length;

                const canSelect =
                  isSelected || shopSelectedCount < planLimit;

                return (
                  <div
                    key={offer.id}
                    className={`p-4 border rounded flex justify-between items-center ${
                      isSelected ? "bg-blue-50 border-blue-500" : ""
                    }`}
                  >
                    <div>
                      <h3 className="font-bold">{offer.title}</h3>
                      <p className="text-sm text-gray-600">
                        {offer.shopName} | Plan: {plan}
                      </p>

                      {!canSelect && (
                        <p className="text-xs text-red-500">
                          Plan limit reached
                        </p>
                      )}
                    </div>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!canSelect}
                      onChange={() => toggleTopFive(offer)}
                    />
                  </div>
                );
              })}
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <AdminAnalytics />
      )}
    </div>
  );
};

export default AdminPanel;