import React, { useState } from "react";
import axios from "axios";

const RegisterShop = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: "",
    address: "",
    category: "",
    description: "",
    phone: "",
    email: "",
  });

  const [document, setDocument] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        shopName: form.name,
        address: form.address,
        category: form.category,
        description: form.description,
        mobileNumber: form.phone,
        email: form.email,
        // ❌ REMOVE shopkeeper from here
      };

      const formData = new FormData();

      formData.append("shop", JSON.stringify(data));

      // ✅ ADD THIS LINE (MOST IMPORTANT)
      formData.append("userId", user.id);

      if (document) {
        formData.append("document", document);
      }

  await axios.post("http://localhost:8080/api/shops", formData);

      alert("Shop registered successfully! Waiting for admin approval.");
      window.location.href = "/shopkeeper-subscription";
    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-10 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register Your Shop</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shop Name */}
        <input
          name="name"
          placeholder="Shop Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        {/* Address */}
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        {/* Category */}
        <input
          name="category"
          placeholder="Category (Food, Clothing, etc.)"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Contact Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        {/* Email */}
        <input
          name="email"
          placeholder="Shop Email (optional)"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* Document Upload */}
        <div>
          <label className="block mb-1 font-semibold">
            Upload Shop Document (License / GST / Proof)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            required
            className="w-full border p-2"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Register Shop
        </button>
      </form>
    </div>
  );
};

export default RegisterShop; 