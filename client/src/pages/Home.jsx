import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, House, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageUrl';
import { AuthContext } from '../context/AuthContext';

const demoHomes = [
  {
    _id: 'demo-joshua-tree',
    title: 'Desert hideaway under the stars',
    location: 'Joshua Tree, California',
    price: 189,
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85'],
  },
  {
    _id: 'demo-coastal-house',
    title: 'A slow morning by the coast',
    location: 'Big Sur, California',
    price: 245,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85'],
  },
  {
    _id: 'demo-mountain-cabin',
    title: 'Woodland cabin with a view',
    location: 'Bend, Oregon',
    price: 164,
    images: ['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=85'],
  },
  {
    _id: 'demo-modern-retreat',
    title: 'Light-filled modern retreat',
    location: 'Austin, Texas',
    price: 210,
    images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85'],
  },
  {
    _id: 'demo-lakeside-home',
    title: 'A little lake house escape',
    location: 'Lake Tahoe, California',
    price: 228,
    images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=85'],
  },
  {
    _id: 'demo-island-villa',
    title: 'Open-air island living',
    location: 'Kailua, Hawaii',
    price: 276,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=85'],
  },
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const [destination, setDestination] = useState('');
  const [submittedDestination, setSubmittedDestination] = useState('');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['publicProperties', submittedDestination],
    queryFn: () => api.get('/properties', {
      params: { limit: 12, destination: submittedDestination || undefined },
    }).then(response => response.data),
  });

  const hasDatabaseHomes = Boolean(data?.data?.length || data?.total);
  const showingDemoHomes = !isLoading && !isError && !hasDatabaseHomes && !submittedDestination;
  const homes = hasDatabaseHomes ? data.data : (showingDemoHomes ? demoHomes : []);
  const hasHost = user?.hostProfile?.status !== 'suspended' && (user?.roles?.includes('host') || user?.role === 'host');
  const hostTarget = user ? (hasHost ? '/host/dashboard' : '/host/onboarding') : '/login';

  return (
    <main className="home-page">
      <header className="site-header">
        <Link className="auth-brand auth-brand-dark" to="/" aria-label="Nest Rivo home">
          <span className="brand-mark"><MapPin size={18} strokeWidth={2.5} /></span>
          <span>NEST<span className="brand-accent">RIVO</span></span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <a className="nav-explore" href="#stays">Explore stays</a>
          {user?.hostProfile?.status !== 'suspended' && (
            <Link className="nav-explore" to={hostTarget} state={!user ? { from: { pathname: '/host/onboarding' } } : undefined}>
              {hasHost ? 'Host dashboard' : 'Become a host'}
            </Link>
          )}
          {user ? (
            <Link className="nav-login" to="/dashboard">My account</Link>
          ) : (
            <>
              <Link className="nav-login" to="/login">Log in</Link>
              <Link className="nav-signup" to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </header>

      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow"><span className="caption-dot" /> STAYS THAT FEEL LIKE YOURS</span>
          <h1>Somewhere new.<br /><em>Somewhere you.</em></h1>
          <p>Find thoughtful places to stay, made for slow mornings and stories worth bringing home.</p>
          <a className="hero-link" href="#stays">Explore homes <ArrowRight size={17} /></a>
        </div>
        <div className="hero-art" role="img" aria-label="A peaceful home surrounded by nature">
          <div className="hero-note">
            <span className="hero-note-icon"><House size={17} /></span>
            <span><strong>Feel at home, anywhere.</strong><small>Find your next favorite place</small></span>
          </div>
        </div>
      </section>

      <section className="listing-section" id="stays">
        <div className="listing-heading">
          <div>
            <p className="eyebrow login-eyebrow">A PLACE FOR EVERY KIND OF GETAWAY</p>
            <h2>Find your somewhere</h2>
            <p className="listing-intro">Browse stays before you book or create an account.</p>
          </div>
          {showingDemoHomes && <span className="demo-collection-label">DEMO COLLECTION</span>}
        </div>

        <form className="home-search" onSubmit={event => {
          event.preventDefault();
          setSubmittedDestination(destination.trim());
        }}>
          <label htmlFor="destination-search"><MapPin size={16} /> Destination</label>
          <input
            id="destination-search"
            value={destination}
            onChange={event => setDestination(event.target.value)}
            placeholder="Try a city or region"
          />
          <button type="submit">Search homes <ArrowRight size={15} /></button>
        </form>

        {isLoading && <div className="homes-state">Finding homes for you…</div>}
        {isError && (
          <div className="homes-state homes-error" role="status">
            We couldn’t load homes right now. Please try again in a moment.
          </div>
        )}
        {!isLoading && !isError && (
          homes.length ? <div className="homes-grid">
            {homes.map((home) => (
              <article className="home-card" key={home._id}>
                {(() => {
                  const cardContent = (
                    <>
                      <div className="home-card-image">
                        <div className="home-image-placeholder"><House size={25} /></div>
                        {home.images?.[0] && <img src={getImageUrl(home.images[0])} alt={home.title} loading="lazy" />}
                        {showingDemoHomes && <span className="demo-home-badge">DEMO HOME</span>}
                      </div>
                      <div className="home-card-copy">
                        <p className="home-location"><MapPin size={14} /> {home.location}</p>
                        <h3>{home.title}</h3>
                        {home.description && <p className="home-description">{home.description}</p>}
                        <p className="home-price"><strong>${Number(home.price || 0).toLocaleString()}</strong> <span>/ night</span></p>
                      </div>
                    </>
                  );
                  return showingDemoHomes ? (
                    <div className="home-card-static">{cardContent}</div>
                  ) : (
                    <Link className="home-card-link" to={`/properties/${home._id}`}>{cardContent}</Link>
                  );
                })()}
              </article>
            ))}
          </div> : <div className="homes-state">No homes matched that destination. Try another place.</div>
        )}
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} NEST RIVO</span>
        <span>Find a place to belong.</span>
        <Link to="/signup">Join NEST RIVO <ArrowRight size={14} /></Link>
      </footer>
    </main>
  );
}
