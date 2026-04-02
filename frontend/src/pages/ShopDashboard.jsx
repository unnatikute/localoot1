import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ShopDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Get logged-in user details (we'll need the ID for the shopkeeper)
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    area: "",
    shopName: "",
    address: "",
    googleMapUrl: "",
    mobileNumber: "",
    imageUrl: "",
    // Pricing fields
    price: "",
    originalPrice: "",
    discount: "",
    // New fields for validity & duration
    validFrom: "",
    validUntil: "",
    durationType: "DAYS",
    durationValue: "",
    // Optional extra image/attachment URLs as comma-separated list for now
    attachmentUrls: "",
    shopkeeper: { id: user?.id }, // Linking the offer to the current user
  });

  // Fetch this shopkeeper's offers on load
  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:8080/api/offers/shopkeeper/${user.id}`)
        .then((res) => setOffers(res.data))
        .catch((err) => console.log(err));
    }
  }, [user?.id]);

  const getValidityLabel = (offer) => {
    const now = new Date();
    const from = offer.validFrom ? new Date(offer.validFrom) : null;
    const until = offer.validUntil ? new Date(offer.validUntil) : null;

    if (offer.status !== 'APPROVED') {
      return null;
    }
    if (from && now < from) {
      return `${t("startsFrom")} ${from.toLocaleString()}`;
    }
    if (until) {
      if (now > until) {
        return t("expired");
      }
      const diffMs = until - now;
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      return `${t("activeFor")} ${days}d ${hours}h ${t("more")}`;
    }
    return t("active");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const fromDate = formData.validFrom ? new Date(formData.validFrom) : now;

      let untilDate = formData.validUntil ? new Date(formData.validUntil) : null;

      if (!untilDate && formData.durationValue) {
        const durationValue = parseInt(formData.durationValue, 10);
        if (durationValue > 0) {
          untilDate = new Date(fromDate);
          if (formData.durationType === "HOURS") {
            untilDate.setHours(untilDate.getHours() + durationValue);
          } else {
            untilDate.setDate(untilDate.getDate() + durationValue);
          }
        }
      }

      if (untilDate && fromDate > untilDate) {
        alert(t("endDateAfterStart"));
        return;
      }

      const submitData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        discount: formData.discount ? parseInt(formData.discount, 10) : null,
        durationValue: formData.durationValue ? parseInt(formData.durationValue, 10) : null,
        validFrom: fromDate ? fromDate.toISOString() : null,
        validUntil: untilDate ? untilDate.toISOString() : null,
      };

      await axios.post("http://localhost:8080/api/offers/create", submitData);
      alert("Offer submitted successfully!");
      setShowForm(false);
      window.location.reload(); // Refresh to show the new pending offer
    } catch (err) {
      console.error(err);
      alert("Error submitting offer. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shop Dashboard</h1>
        <div className="flex gap-3">
          <Link
            to="/shopkeeper-subscription"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
          >
            Subscription History
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showForm ? "Close Form" : "+ Add New Offer"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Offer Title"
            className="p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Category"
            className="p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Area"
            className="p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className="p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, mobileNumber: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Shop Name"
            className="p-2 border rounded md:col-span-2"
            onChange={(e) =>
              setFormData({ ...formData, shopName: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Full Address"
            className="p-2 border rounded md:col-span-2"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Google Maps URL"
            className="p-2 border rounded md:col-span-2"
            onChange={(e) =>
              setFormData({ ...formData, googleMapUrl: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Main Image URL"
            className="p-2 border rounded md:col-span-2"
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Offer Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 499"
                className="p-2 border rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 999"
                className="p-2 border rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 50"
                className="p-2 border rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
              />
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Offer Start Date
              </label>
              <input
                type="datetime-local"
                className="p-2 border rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, validFrom: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Offer End Date
              </label>
              <input
                type="datetime-local"
                className="p-2 border rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Duration
              </label>
              <div className="flex gap-2">
                <select
                  className="p-2 border rounded w-1/2"
                  value={formData.durationType}
                  onChange={(e) =>
                    setFormData({ ...formData, durationType: e.target.value })
                  }
                >
                  <option value="HOURS">Hours</option>
                  <option value="DAYS">Days</option>
                </select>
                <input
                  type="number"
                  min="1"
                  className="p-2 border rounded w-1/2"
                  placeholder="Value"
                  onChange={(e) =>
                    setFormData({ ...formData, durationValue: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <textarea
            placeholder="Additional Images (comma separated)"
            className="p-2 border rounded md:col-span-2 text-sm"
            rows={2}
            onChange={(e) =>
              setFormData({ ...formData, attachmentUrls: e.target.value })
            }
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded md:col-span-2"
          >
            Submit for Approval
          </button>
        </form>
      )}

      <h2 className="text-xl font-semibold mb-4">My Offers Status</h2>
      <div className="grid grid-cols-1 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="border p-4 rounded flex justify-between items-center bg-white shadow-sm"
          >
            <div>
              <h3 className="font-bold">{offer.title}</h3>
              <p className="text-sm text-gray-600">
                {offer.shopName} - {offer.area}
              </p>
              {offer.validFrom && offer.validUntil && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(offer.validFrom).toLocaleString()} &rarr;{" "}
                  {new Date(offer.validUntil).toLocaleString()}
                </p>
              )}
              {getValidityLabel(offer) && (
                <p className="text-xs text-blue-600 mt-1">{getValidityLabel(offer)}</p>
              )}
              {offer.status === "REJECTED" && offer.adminStatusComment && (
                <p className="text-xs text-red-600 mt-1">
                  Rejected: {offer.adminStatusComment}
                </p>
              )}
            </div>
            <span
              className={`px-3 py-1 rounded text-sm ${
                offer.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {offer.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopDashboard;
