import React, { useState, useEffect } from "react";
import axios from "axios";
import ShopsManagement from "../components/AdminShopsTab";
import UsersManagement from "../components/AdminUsersTab";
import AnalyticsTab from "../components/AdminAnalyticsTab";
import { Store, Users, BarChart3, ClipboardCheck } from "lucide-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("offers");
  const [pendingOffers, setPendingOffers] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = () => {
    axios
      .get("http://localhost:8080/api/offers/admin/pending")
      .then((res) => setPendingOffers(res.data))
      .catch((err) => console.error("Error fetching pending offers:", err));
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/offers/admin/approve/${id}`);
      alert("Offer Approved successfully!");
      fetchPending();
    } catch (err) {
      alert("Failed to approve offer.");
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
        <h1 className="text-4xl font-bold mb-2">🎛️ Admin Dashboard</h1>
        <p className="text-blue-100">Manage shops, users, offers, and view platform analytics</p>
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
                      <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

export default AdminPanel;
