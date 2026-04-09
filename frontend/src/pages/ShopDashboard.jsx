import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ShopDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [shop, setShop] = useState(null);

  // Get logged-in user details
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
    price: "",
    originalPrice: "",
    discount: "",
    validFrom: "",
    validUntil: "",
    durationType: "DAYS",
    durationValue: "",
    attachmentUrls: "",
    shopkeeper: { id: user?.id },
  });

  // Fetch shop & offers
  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:8080/api/offers/shopkeeper/${user.id}?all=true`)
        .then((res) => setOffers(res.data))
        .catch((err) => console.log(err));

      axios
        .get(`http://localhost:8080/api/shops/my-shop?shopkeeperId=${user.id}`)
        .then((res) => setShop(res.data))
        .catch((err) => console.log(err));
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
      let untilDate = formData.validUntil ? new Date(formData.validUntil) : null;

      if (!untilDate && formData.durationValue) {
        const durationValue = parseInt(formData.durationValue, 10);
        untilDate = new Date(fromDate);
        if (formData.durationType === "HOURS") {
          untilDate.setHours(untilDate.getHours() + durationValue);
        } else {
          untilDate.setDate(untilDate.getDate() + durationValue);
        }
      }

      if (untilDate && fromDate > untilDate) {
        alert("End date must be after start date");
        return;
      }

      const submitData = {
        ...formData,
        shopkeeper: { id: user.id },
        price: formData.price ? parseFloat(formData.price) : null,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        discount: formData.discount ? parseInt(formData.discount, 10) : null,
        durationValue: formData.durationValue ? parseInt(formData.durationValue, 10) : null,
        validFrom: fromDate ? fromDate.toISOString().slice(0, 19) : null,
        validUntil: untilDate ? untilDate.toISOString().slice(0, 19) : null,
        attachmentUrls: formData.attachmentUrls
          ? formData.attachmentUrls.split(",").map((url) => url.trim())
          : [],
      };

      await axios.post("http://localhost:8080/api/offers/create", submitData);
      alert("Offer submitted successfully!");
      setShowForm(false);
      window.location.reload();
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
          {/* Your form inputs here */}
        </form>
      )}

      {shop && (
        <div className="mb-6 p-4 border rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-2">My Shop</h2>
          <p className="font-bold">{shop.shopName} - {shop.area}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded text-sm ${
              shop.registrationStatus === "APPROVED"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {shop.registrationStatus === "PENDING" ? "Pending for Approval" : shop.registrationStatus}
          </span>
        </div>
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