import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageUrl';

export default function GuestWishlist() {
  const queryClient = useQueryClient();
  const wishlist = useQuery({
    queryKey: ['guestWishlist'],
    queryFn: () => api.get('/wishlist').then(response => response.data.data),
  });

  const remove = async propertyId => {
    try {
      await api.delete(`/wishlist/${propertyId}`);
      queryClient.invalidateQueries({ queryKey: ['guestWishlist'] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update your wishlist');
    }
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link className="auth-brand auth-brand-dark" to="/"><span className="brand-mark"><MapPin size={18} /></span><span>NEST<span className="brand-accent">RIVO</span></span></Link>
        <nav className="dashboard-page-nav" aria-label="Guest dashboard navigation">
          <Link className="onboarding-back" to="/#stays">Explore homes</Link>
          <Link className="onboarding-back" to="/dashboard">Guest dashboard</Link>
        </nav>
      </header>
      <section className="dashboard-content">
        <p className="eyebrow login-eyebrow"><Heart size={13} /> SAVED FOR LATER</p>
        <h1 className="dashboard-title">Your wishlist</h1>
        {wishlist.isLoading && <div className="dashboard-state">Loading your wishlist…</div>}
        {wishlist.isError && <div className="dashboard-state dashboard-error">Could not load your wishlist.</div>}
        {wishlist.data?.length === 0 && <div className="dashboard-state">Your wishlist is empty. <Link to="/">Explore homes</Link></div>}
        <div className="homes-grid">
          {wishlist.data?.map(entry => (
            <article className="home-card" key={entry._id}>
              <Link className="home-card-link" to={`/properties/${entry.property._id}`}>
                <div className="home-card-image">{entry.property.images?.[0] && <img src={getImageUrl(entry.property.images[0])} alt={entry.property.title} loading="lazy" />}</div>
                <div className="home-card-copy"><p className="home-location"><MapPin size={14} /> {entry.property.location}</p><h3>{entry.property.title}</h3><p className="home-price"><strong>${Number(entry.property.price).toLocaleString()}</strong> <span>/ night</span></p></div>
              </Link>
              <button className="subtle-action" type="button" onClick={() => remove(entry.property._id)}>Remove from wishlist</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
