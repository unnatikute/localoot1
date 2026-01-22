import React, { useState, useEffect } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/offers/create", formData);
      alert("Offer submitted! Waiting for Admin approval.");
      setShowForm(false);
      window.location.reload(); // Refresh to show the new pending offer
    } catch (err) {
      alert("Error submitting offer");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopkeeper Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Close Form" : "+ Add New Offer"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Offer Title (e.g. 20% Off)"
            className="p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Category (e.g. Fashion, Food)"
            className="p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Area (e.g. Pimpri)"
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
            placeholder="Image URL (Paste image link)"
            className="p-2 border rounded md:col-span-2"
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
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
