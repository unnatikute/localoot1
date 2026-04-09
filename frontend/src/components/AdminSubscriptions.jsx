import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminSubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(
  "http://localhost:8080/api/subscriptions/all"
); // later make dynamic
      setSubscriptions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const cancelSubscription = async (id) => {
    if (!window.confirm("Are you sure to cancel this subscription?")) return;

    try {
      await axios.put(
        `http://localhost:8080/api/subscriptions/cancel/${id}`
      );
      alert("Subscription Cancelled ❌");
      fetchSubscriptions();
    } catch (err) {
      alert("Error cancelling subscription");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>

  {subscriptions.map((sub) => (
  <div
    key={sub.id}
    className="border p-4 rounded mb-3 flex justify-between"
  >
    <div>
      <p><b>User:</b> {sub.shopkeeperName}</p>
      <p><b>Package:</b> {sub.packageName}</p>
      <p><b>Status:</b> {sub.status}</p>
    </div>

    {sub.status === "ACTIVE" && (
      <button
        onClick={() => cancelSubscription(sub.id)}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    )}
  </div>
))}
    </div>
  );
};

export default AdminSubscriptionsTab;