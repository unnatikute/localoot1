import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
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
      fetchPending(); // Refresh list after approval
    } catch (err) {
      alert("Failed to approve offer.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">
        Admin Approval Queue
      </h1>

      {pendingOffers.length === 0 ? (
        <div className="bg-blue-50 p-4 rounded text-blue-700">
          No pending offers found.
        </div>
      ) : (
        <div className="space-y-4">
          {pendingOffers.map((offer) => (
            <div
              key={offer.id}
              className="border p-5 rounded-lg shadow-md bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-bold">{offer.title}</h2>
                <p className="text-gray-700">
                  <strong>Shop:</strong> {offer.shopName}
                </p>
                <p className="text-gray-600">
                  <strong>Area:</strong> {offer.area} |{" "}
                  <strong>Category:</strong> {offer.category}
                </p>
                <p className="text-sm text-gray-500">
                  Contact: {offer.mobileNumber}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleApprove(offer.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button className="text-red-500 text-sm hover:underline">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
