import { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  async function submit(e) {
    e.preventDefault();
    setStatus('');
    try {
      await axios.post('/api/contact', { name, email, message });
      setStatus('Thanks! We will get back to you.');
      setName(''); setEmail(''); setMessage('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to send');
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg p-6 border">
      <h2 className="text-2xl font-bold mb-2">Contact us</h2>
      <p className="text-gray-600 mb-4">Have a question or want to list your shop? Send us a message.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea className="mt-1 w-full border rounded px-3 py-2" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        {status && <p className="text-sm">{status}</p>}
        <button className="px-4 py-2 bg-brand text-white rounded" type="submit">Send</button>
      </form>
    </div>
  );
}


