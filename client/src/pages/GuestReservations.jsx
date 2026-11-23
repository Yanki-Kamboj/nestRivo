import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useState } from 'react';

function ReviewForm({ booking, onReviewed }) {
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const submitReview = async event => {
    event.preventDefault();
    try {
      await api.post('/reviews', { bookingId: booking._id, rating: Number(rating), comment });
      toast.success('Review shared');
      onReviewed();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit your review');
    }
  };

  return (
    <form className="review-form" onSubmit={submitReview}>
      <label>Rate your stay
        <select value={rating} onChange={event => setRating(event.target.value)}>
          {[5, 4, 3, 2, 1].map(value => <option value={value} key={value}>{value} / 5</option>)}
        </select>
      </label>
      <textarea aria-label="Review" value={comment} onChange={event => setComment(event.target.value)} maxLength={2000} placeholder="Share a few words about your stay" />
      <button type="submit">Leave a review</button>
    </form>
  );
}

export default function GuestReservations() {
  const queryClient = useQueryClient();
  const reservations = useQuery({
    queryKey: ['guestReservations'],
    queryFn: () => api.get('/bookings/mine').then(response => response.data.data),
  });

  const cancel = async bookingId => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      toast.success('Reservation cancelled');
      queryClient.invalidateQueries({ queryKey: ['guestReservations'] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not cancel this reservation');
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
        <p className="eyebrow login-eyebrow">YOUR TRIPS</p>
        <h1 className="dashboard-title">Reservations</h1>
        {reservations.isLoading && <div className="dashboard-state">Loading reservations…</div>}
        {reservations.isError && <div className="dashboard-state dashboard-error">Could not load reservations.</div>}
        {reservations.data?.length === 0 && <div className="dashboard-state">No reservations yet. <Link to="/">Explore homes</Link></div>}
        <div className="reservation-list">
          {reservations.data?.map(booking => (
            <article className="reservation-card" key={booking._id}>
              <div><h2>{booking.property?.title || 'Stay'}</h2><p><MapPin size={14} /> {booking.property?.location}</p><p><CalendarDays size={14} /> {new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}</p></div>
              <span className={`listing-status status-${booking.status}`}>{booking.status}</span>
              {['pending', 'confirmed'].includes(booking.status) && new Date(booking.checkIn) > new Date() && <button className="subtle-action" type="button" onClick={() => cancel(booking._id)}>Cancel reservation</button>}
              {(booking.status === 'completed' || (booking.status === 'confirmed' && new Date(booking.checkOut) <= new Date())) && (
                booking.reviewed
                  ? <p className="reservation-review-done">Review submitted</p>
                  : <ReviewForm booking={booking} onReviewed={() => queryClient.invalidateQueries({ queryKey: ['guestReservations'] })} />
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
