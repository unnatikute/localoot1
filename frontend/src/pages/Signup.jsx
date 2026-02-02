import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roleParam = params.get("role");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(() => {
    if (roleParam) {
      const r = roleParam.toLowerCase();
      if (r.includes("shop")) return "SHOPKEEPER";
      return "USER";
    }
    return "USER";
  });

  // Update role when URL param changes
  useEffect(() => {
    if (roleParam) {
      const r = roleParam.toLowerCase();
      setRole(r.includes("shop") ? "SHOPKEEPER" : "USER");
    }
  }, [roleParam]);
  const [area, setArea] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        role,
        area,
        shopName: role === "SHOPKEEPER" ? shopName : null,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Account created successfully! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email already registered");
      } else {
        setError(err.response?.data || "Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Create your account</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-2"
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2"
        >
          <option value="USER">Customer</option>
          <option value="SHOPKEEPER">Shopkeeper</option>
        </select>

        {role === "SHOPKEEPER" && (
          <input
            placeholder="Shop Name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            className="w-full border p-2"
          />
        )}

        <input
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
          className="w-full border p-2"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Creating account..." : "Sign up"}
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
