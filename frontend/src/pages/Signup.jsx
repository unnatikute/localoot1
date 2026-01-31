import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [area, setArea] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("localoot_users")) || [];

    // ❌ Prevent duplicate email
    if (users.some((u) => u.email === email)) {
      setError("Email already registered");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // ❗ plain for now (backend will hash later)
      role,
      area,
      shopName: role === "SHOPKEEPER" ? shopName : null,
    };

    users.push(newUser);
    localStorage.setItem("localoot_users", JSON.stringify(users));

    navigate("/login");
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Create your account</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="w-full border p-2" />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border p-2" />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border p-2" />

        <select value={role} onChange={e => setRole(e.target.value)} className="w-full border p-2">
          <option value="USER">Customer</option>
          <option value="SHOPKEEPER">Shopkeeper</option>
        </select>

        {role === "SHOPKEEPER" && (
          <input
            placeholder="Shop Name"
            value={shopName}
            onChange={e => setShopName(e.target.value)}
            required
            className="w-full border p-2"
          />
        )}

        <input placeholder="Area" value={area} onChange={e => setArea(e.target.value)} required className="w-full border p-2" />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Sign up
        </button>
      </form>

      <p className="text-sm mt-3 text-center">
        Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  );
}
