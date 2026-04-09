import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterShops = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    mobileNumber: "",
    email: "",
    area: "",
    category: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        shopkeeperId: user?.id,
      };

      await axios.post("http://localhost:8080/api/shops/register", payload);

      alert("Shop Registered Successfully! Pending for approval.");

      navigate("/shop-dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Register Your Shop</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

      

        <input
          type="text"
          name="mobile_number"
          placeholder="Mobile Number"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="area"
          placeholder="Area"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category (Food, Clothing, etc.)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Full Address"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Register Shop
        </button>
      </form>
    </div>
  );
};

export default RegisterShops;
