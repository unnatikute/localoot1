import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="relative h-72 rounded-2xl overflow-hidden">
        <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?q=80&w=1600&auto=format&fit=crop" alt="Localoot hero" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 p-8 text-white max-w-xl">
          <h1 className="text-4xl font-extrabold leading-tight">Discover trending local offers near you</h1>
          <p className="mt-3 opacity-95">Find the best deals across Food, Fashion, Electronics and more. Save your favorites and never miss out.</p>
          <div className="mt-5 flex gap-3">
            <Link to="/categories" className="px-4 py-2 bg-brand rounded text-white hover:bg-brand-dark">Browse Categories</Link>
            <Link to="/contact" className="px-4 py-2 bg-white/10 border border-white/30 rounded hover:bg-white/20">Partner with us</Link>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Food & Dining', desc: 'Hot deals from nearby restaurants', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
          { title: 'Fashion', desc: 'Trendy styles and seasonal sales', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop' },
          { title: 'Electronics', desc: 'Latest gadgets and discounts', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'  }
        ].map((c) => (
          <div key={c.title} className="group relative h-56 rounded-xl overflow-hidden">
            <img src={c.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" alt={c.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-4 text-white">
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <p className="text-white/90 text-sm">{c.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Top picks for you</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Combo meals under ₹199', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
            { title: 'Festive kurtas & more', img: 'https://images.unsplash.com/photo-1520975961572-6c0e4c76b0b7?q=80&w=800&auto=format&fit=crop' },
            { title: 'Smart wearables', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop' },
            { title: 'Salon & spa offers', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop' }
          ].map(card => (
            <div key={card.title} className="bg-white border rounded-xl overflow-hidden">
              <img src={card.img} className="w-full h-36 object-cover" alt={card.title} />
              <div className="p-4">
                <p className="font-medium">{card.title}</p>
                <Link to="/categories" className="text-brand text-sm">Shop now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Fast updates', desc: 'Trending offers refreshed daily for your city.' },
            { title: 'Area wise search', desc: 'Find deals near Kothrud, Baner, Hinjawadi and more.' },
            { title: 'Save & track', desc: 'Like, bookmark, and save shops for quick access.' }
          ].map((f) => (
            <div key={f.title}>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


