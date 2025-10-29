import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/auth.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      login(data);
      const from = location.state?.from?.pathname || '/categories';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {location.state?.notice && (
        <div className="mb-3 px-3 py-2 text-sm rounded bg-yellow-50 text-yellow-800 border border-yellow-200">{location.state.notice}</div>
      )}
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark" type="submit">Login</button>
      </form>
      <p className="text-sm mt-3">No account? <Link to="/signup" className="text-brand">Sign up</Link></p>
    </div>
  );
}


