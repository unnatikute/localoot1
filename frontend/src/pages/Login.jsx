import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import axios from "axios";


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roleParam = params.get("role");


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);




  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ HARDCODED ADMIN LOGIN
    if (email === "admin@gmail.com" && password === "admin123") {
      const adminUser = {
        name: "Admin",
        email: "admin@gmail.com",
        role: "ADMIN",
        token: "hardcoded-token",
      };

      login(adminUser);
      navigate("/");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        
        const rawRole =
          response.data.role ||
          (response.data.roles &&
            (Array.isArray(response.data.roles)
              ? response.data.roles[0]
              : response.data.roles)) ||
          (response.data.authorities &&
            (Array.isArray(response.data.authorities)
              ? response.data.authorities[0]
              : response.data.authorities)) ||
          roleParam ||
          "user";

        let roleNormalized = String(rawRole || "user").toLowerCase();
        roleNormalized = roleNormalized
          .replace(/^role_/, "")
          .replace(/^roles_/, "");

        if (roleNormalized.includes("admin")) roleNormalized = "ADMIN";
        else if (
          roleNormalized.includes("shop") ||
          roleNormalized.includes("owner") ||
          roleNormalized.includes("keeper")
        )
          roleNormalized = "SHOPKEEPER";
        else roleNormalized = "USER";

        const userData = {
          ...response.data,
          role: roleNormalized,
        };

        login(userData);
          // ✅ SAVE TOKEN HERE
  
        navigate("/");
      }
    } catch (err) {
      // Demo fallback
      if (roleParam) {
        const roleNormalized = roleParam.toLowerCase().includes("admin")
          ? "ADMIN"
          : roleParam.toLowerCase().includes("shop")
          ? "SHOPKEEPER"
          : "USER";

          
        const demoUser = {
          name:
            roleNormalized === "ADMIN"
              ? "Demo Admin"
              : roleNormalized === "SHOPKEEPER"
              ? "Demo Shopkeeper"
              : "Demo User",
          email: email || `${roleParam}@demo.local`,
          role: roleNormalized,
          token: "demo-token",
        };

        login(demoUser);
        navigate("/");
        return;
      }

      setError(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Login to your account</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
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

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm mt-3 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600">
          Sign up
        </Link>
      </p>
    </div>
  );
}