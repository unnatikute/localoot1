import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings, Package, DollarSign, Calendar } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState("settings");
  const [loading, setLoading] = useState(true);

  // Settings form state
  const [formSettings, setFormSettings] = useState({
    defaultMonthlyOfferLimit: 2,
    defaultYearlyOfferLimit: 24,
    requireSubscriptionForOffers: true,
    autoRenewSubscriptions: false,
    daysBeforeExpiryToNotify: 7,
    defaultCurrency: "INR",
  });

  // Package form state
  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    monthlyOfferLimit: 5,
    yearlyOfferLimit: 60,
    monthlyPrice: 0,
    yearlyPrice: 0,
    durationType: "BOTH",
    isActive: true,
    displayOrder: 0,
  });
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchPackages();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/subscriptions/admin/settings");
      setSettings(res.data);
      setFormSettings({
        defaultMonthlyOfferLimit: res.data.defaultMonthlyOfferLimit || 2,
        defaultYearlyOfferLimit: res.data.defaultYearlyOfferLimit || 24,
        requireSubscriptionForOffers: res.data.requireSubscriptionForOffers !== false,
        autoRenewSubscriptions: res.data.autoRenewSubscriptions || false,
        daysBeforeExpiryToNotify: res.data.daysBeforeExpiryToNotify || 7,
        defaultCurrency: res.data.defaultCurrency || "INR",
      });
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/subscriptions/packages");
      setPackages(res.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const saveSettings = async () => {
    try {
      await axios.put("http://localhost:8080/api/subscriptions/admin/settings", formSettings);
      alert("Settings saved successfully!");
      fetchSettings();
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  const savePackage = async (e) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await axios.put(`http://localhost:8080/api/subscriptions/packages/${editingPackage.id}`, packageForm);
        alert("Package updated!");
      } else {
        await axios.post("http://localhost:8080/api/subscriptions/packages", packageForm);
        alert("Package created!");
      }
      setEditingPackage(null);
      setPackageForm({
        name: "",
        description: "",
        monthlyOfferLimit: 5,
        yearlyOfferLimit: 60,
        monthlyPrice: 0,
        yearlyPrice: 0,
        durationType: "BOTH",
        isActive: true,
        displayOrder: 0,
      });
      fetchPackages();
    } catch (err) {
      alert("Failed to save package");
    }
  };

  const editPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      description: pkg.description || "",
      monthlyOfferLimit: pkg.monthlyOfferLimit,
      yearlyOfferLimit: pkg.yearlyOfferLimit,
      monthlyPrice: pkg.monthlyPrice,
      yearlyPrice: pkg.yearlyPrice,
      durationType: pkg.durationType,
      isActive: pkg.isActive,
      displayOrder: pkg.displayOrder || 0,
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Settings className="w-10 h-10" />
          Admin Settings
        </h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "settings"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              System Settings
            </button>
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "packages"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Subscription Packages
            </button>
          </div>
        </div>

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">System Configuration</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Default Monthly Offer Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border rounded-lg"
                    value={formSettings.defaultMonthlyOfferLimit}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        defaultMonthlyOfferLimit: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Offers per month for shops without subscription
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Default Yearly Offer Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border rounded-lg"
                    value={formSettings.defaultYearlyOfferLimit}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        defaultYearlyOfferLimit: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formSettings.requireSubscriptionForOffers}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          requireSubscriptionForOffers: e.target.checked,
                        })
                      }
                    />
                    <span className="font-semibold">Require Subscription for Offers</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    If enabled, shops must have active subscription to display offers
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Days Before Expiry to Notify
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border rounded-lg"
                    value={formSettings.daysBeforeExpiryToNotify}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        daysBeforeExpiryToNotify: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <button
                onClick={saveSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            {/* Package Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingPackage ? "Edit Package" : "Create New Package"}
              </h2>
              <form onSubmit={savePackage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Package Name</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded"
                      value={packageForm.name}
                      onChange={(e) =>
                        setPackageForm({ ...packageForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Display Order</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={packageForm.displayOrder}
                      onChange={(e) =>
                        setPackageForm({ ...packageForm, displayOrder: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      rows={3}
                      value={packageForm.description}
                      onChange={(e) =>
                        setPackageForm({ ...packageForm, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Monthly Offer Limit</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="w-full p-2 border rounded"
                      value={packageForm.monthlyOfferLimit}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          monthlyOfferLimit: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Yearly Offer Limit</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full p-2 border rounded"
                      value={packageForm.yearlyOfferLimit}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          yearlyOfferLimit: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Monthly Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className="w-full p-2 border rounded"
                      value={packageForm.monthlyPrice}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          monthlyPrice: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Yearly Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className="w-full p-2 border rounded"
                      value={packageForm.yearlyPrice}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          yearlyPrice: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Duration Type</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={packageForm.durationType}
                      onChange={(e) =>
                        setPackageForm({ ...packageForm, durationType: e.target.value })
                      }
                    >
                      <option value="MONTHLY">Monthly Only</option>
                      <option value="YEARLY">Yearly Only</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      checked={packageForm.isActive}
                      onChange={(e) =>
                        setPackageForm({ ...packageForm, isActive: e.target.checked })
                      }
                    />
                    <label className="font-semibold">Active</label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    {editingPackage ? "Update Package" : "Create Package"}
                  </button>
                  {editingPackage && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPackage(null);
                        setPackageForm({
                          name: "",
                          description: "",
                          monthlyOfferLimit: 5,
                          yearlyOfferLimit: 60,
                          monthlyPrice: 0,
                          yearlyPrice: 0,
                          durationType: "BOTH",
                          isActive: true,
                          displayOrder: 0,
                        });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Packages List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Existing Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border-2 rounded-lg p-4 ${
                      pkg.isActive ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          pkg.isActive ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Monthly:</strong> {pkg.monthlyOfferLimit} offers - ₹{pkg.monthlyPrice}
                      </p>
                      <p>
                        <strong>Yearly:</strong> {pkg.yearlyOfferLimit} offers - ₹{pkg.yearlyPrice}
                      </p>
                    </div>
                    <button
                      onClick={() => editPackage(pkg)}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
