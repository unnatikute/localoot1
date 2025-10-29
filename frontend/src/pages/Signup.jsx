import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/auth.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('/api/auth/signup', { name, email, password });
      login(data);
      navigate('/categories', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create your account</h2>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark" type="submit">Sign up</button>
      </form>
      <p className="text-sm mt-3">Already have an account? <Link to="/login" className="text-brand">Login</Link></p>
    </div>
  );
}


