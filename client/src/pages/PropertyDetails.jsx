import { useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays, Heart, MapPin, Star } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const propertyQuery = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => api.get(`/properties/${propertyId}`).then(response => response.data.data),
  });
  const property = propertyQuery.data;
  const reviewsQuery = useQuery({
    queryKey: ['propertyReviews', propertyId],
    queryFn: () => api.get(`/properties/${propertyId}/reviews`).then(response => response.data.data),
    enabled: Boolean(property),
  });
  const wishlistQuery = useQuery({
    queryKey: ['wishlistStatus', user?.id, propertyId],
    queryFn: () => api.get(`/wishlist/${propertyId}`).then(response => response.data.data.saved),
    enabled: Boolean(user && property),
  });
  const isWishlisted = Boolean(wishlistQuery.data);
  const isOwner = user && property && String(property.host?._id || property.host) === String(user.id);

  const requireLogin = () => navigate('/login', { state: { from: { pathname: location.pathname } } });

  const toggleWishlist = async () => {
    if (!user) return requireLogin();
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${property._id}`);
      } else {
        await api.post(`/wishlist/${property._id}`);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['wishlistStatus', user.id, propertyId] }),
        queryClient.invalidateQueries({ queryKey: ['guestWishlist'] }),
      ]);
      toast.success(isWishlisted ? 'Removed from your wishlist' : 'Saved to your wishlist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save this home');
    }
  };

  const bookStay = async event => {
    event.preventDefault();
    if (!user) return requireLogin();
    try {
      await api.post('/bookings', {
        propertyId: property._id,
        checkIn,
        checkOut,
        guests: Number(guests),
      });
      toast.success('Booking request sent');
      navigate('/dashboard/reservations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not request this stay');
    }
  };

  if (propertyQuery.isLoading) return <div className="dashboard-state">Loading this home…</div>;
  if (propertyQuery.isError) {
    return <main className="dashboard-page"><div className="dashboard-state dashboard-error">This home is unavailable. <Link to="/">Browse homes</Link></div></main>;
  }

  return (
    <main className="property-detail-page">
      <header className="dashboard-header">
        <Link className="auth-brand auth-brand-dark" to="/">
          <span className="brand-mark"><MapPin size={18} strokeWidth={2.5} /></span>
          <span>NEST<span className="brand-accent">RIVO</span></span>
        </Link>
        <Link className="onboarding-back" to="/"><ArrowLeft size={15} /> Browse homes</Link>
      </header>
      <section className="property-detail-content">
        <p className="home-location"><MapPin size={15} /> {property.location}</p>
        <div className="property-detail-heading">
          <div><h1>{property.title}</h1><p>Hosted by {property.host?.hostProfile?.displayName || property.host?.name || 'NEST RIVO host'}</p></div>
          <button
            className={`wishlist-button${isWishlisted ? ' wishlist-button-saved' : ''}`}
            type="button"
            onClick={toggleWishlist}
            aria-pressed={isWishlisted}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            {isWishlisted ? 'Saved' : 'Save'}
          </button>
        </div>
        <div className="property-photo-grid">
          {property.images?.slice(0, 5).map((image, index) => <img key={`${image}-${index}`} src={getImageUrl(image)} alt={`${property.title} ${index + 1}`} />)}
          {!property.images?.length && <div className="property-photo-empty">Photos coming soon</div>}
        </div>
        <div className="property-detail-columns">
          <section className="property-description">
            <h2>About this place</h2>
            <p>{property.description}</p>
            <p>Up to {property.maxGuests || 2} guests · ${Number(property.price).toLocaleString()} per night</p>
            {property.amenities?.length > 0 && <><h3>What this place offers</h3><ul>{property.amenities.map(item => <li key={item}>{item}</li>)}</ul></>}
          </section>
          <form className="booking-card" onSubmit={bookStay}>
            <p className="booking-card-price"><strong>${Number(property.price).toLocaleString()}</strong> / night</p>
            <label htmlFor="detail-checkin"><CalendarDays size={15} /> Check in</label>
            <input id="detail-checkin" type="date" min={new Date().toISOString().slice(0, 10)} value={checkIn} onChange={event => setCheckIn(event.target.value)} required />
            <label htmlFor="detail-checkout">Check out</label>
            <input id="detail-checkout" type="date" min={checkIn || new Date().toISOString().slice(0, 10)} value={checkOut} onChange={event => setCheckOut(event.target.value)} required />
            <label htmlFor="detail-guests">Guests</label>
            <input id="detail-guests" type="number" min="1" max={property.maxGuests || 2} value={guests} onChange={event => setGuests(event.target.value)} required />
            {isOwner ? <p className="owner-booking-note">You can’t book your own home.</p> : (
              <button className="sign-in-button" type="submit">{user ? 'Request to book' : 'Log in to book'}</button>
            )}
            <p className="booking-note">You won’t be charged yet.</p>
          </form>
        </div>
        <section className="property-reviews">
          <h2><Star size={18} /> Guest reviews</h2>
          {reviewsQuery.isLoading && <p>Loading reviews…</p>}
          {reviewsQuery.data?.length === 0 && <p>No reviews yet.</p>}
          {reviewsQuery.data?.map(review => (
            <article key={review._id} className="property-review">
              <strong>{review.guest?.name || 'Guest'} · {review.rating}/5</strong>
              <p>{review.comment}</p>
              {review.hostResponse && <p className="host-response">Host response: {review.hostResponse}</p>}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
