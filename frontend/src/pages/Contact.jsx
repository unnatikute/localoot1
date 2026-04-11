import { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-6xl bg-slate-950 text-white rounded-[36px] overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] px-6 py-10 sm:px-10 sm:py-12">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-400">Contact</p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Reach out to LocalLoot
              </h1>
              <p className="text-gray-300 max-w-xl leading-8">
                Have a question, want to list your shop, or need help with an offer? Send us a message and we will respond quickly.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white/5 border border-white/10 p-5 shadow-lg shadow-slate-950/10"
              >
                <p className="text-sm text-pink-300 uppercase tracking-[0.18em] mb-2">Email</p>
                <p className="text-lg font-semibold text-white">support@localloot.com</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white/5 border border-white/10 p-5 shadow-lg shadow-slate-950/10"
              >
                <p className="text-sm text-pink-300 uppercase tracking-[0.18em] mb-2">Response time</p>
                <p className="text-lg font-semibold text-white">Within 24 hours</p>
              </motion.div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-slate-950/10">
              <p className="text-sm uppercase tracking-[0.18em] text-pink-300 mb-3">Why contact us?</p>
              <ul className="space-y-3 text-gray-300 text-sm leading-7">
                <li>• List your business and reach more customers</li>
                <li>• Report an issue or ask for support</li>
                <li>• Suggest improvements or new features</li>
              </ul>
            </div>
          </div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="rounded-[32px] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {status && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-200"
                >
                  {status}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full rounded-3xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-pink-500/20 transition hover:brightness-110"
              >
                Send Message
              </button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}


