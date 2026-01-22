import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../store/auth.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 1. Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // Default to USER
  const [area, setArea] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    // 2. Prepare the data to match your Java User.java model
    const userData = {
      name,
      email,
      password,
      role,
      area,
      shopName: role === "SHOPKEEPER" ? shopName : null,
    };

    try {
      // 3. Connect to Java (Port 8080)
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/signup",
        userData
      );

      // Since our Java controller currently returns a String, we handle it here
      console.log("Success:", data);

      // Navigate to categories or login after success
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Signup failed. Make sure Backend is running!"
      );
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Create your account</h2>
      <form className="space-y-4" onSubmit={onSubmit}>
        {/* Name, Email, Password Fields */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* 4. Role Selection (Crucial for your localoot logic) */}
        <div>
          <label className="block text-sm font-medium">I am a:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value="USER">Customer</option>
            <option value="SHOPKEEPER">Shopkeeper</option>
          </select>
        </div>

        {/* 5. Conditional Shop Name Field */}
        {role === "SHOPKEEPER" && (
          <div>
            <label className="block text-sm font-medium">Shop Name</label>
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Area / Location</label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. Model Town"
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Sign up
        </button>
      </form>
      <p className="text-sm mt-3 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
}
