import { useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, MapPin, Plus, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageUrl';
import DashboardSwitcher from '../components/DashboardSwitcher';
import { AuthContext } from '../context/AuthContext';

function ListingCard({ property, onUpdated }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const blockedDates = useQuery({
    queryKey: ['hostBlockedDates', property._id],
    queryFn: () => api.get(`/host/properties/${property._id}/blocked-dates`).then(response => response.data.data),
  });

  const toggleActive = async () => {
    try {
      await api.patch(`/properties/${property._id}`, { isActive: !property.isActive });
      toast.success(property.isActive ? 'Listing paused' : 'Listing activated');
      onUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update listing');
    }
  };

  const blockDates = async event => {
    event.preventDefault();
    try {
      await api.post(`/host/properties/${property._id}/blocked-dates`, { start, end });
      toast.success('Availability updated');
      setStart('');
      setEnd('');
      queryClient.invalidateQueries({ queryKey: ['hostBlockedDates', property._id] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not block those dates');
    }
  };

  const updateListing = async event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await api.patch(`/properties/${property._id}`, {
        title: formData.get('title'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
      });
      toast.success('Listing updated');
      setIsEditing(false);
      onUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update listing');
    }
  };

  const deleteListing = async () => {
    if (!window.confirm('Remove this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/properties/${property._id}`);
      toast.success('Listing removed');
      onUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove listing');
    }
  };

  const removeBlockedDate = async blockedDateId => {
    try {
      await api.delete(`/host/blocked-dates/${blockedDateId}`);
      toast.success('Blocked dates removed');
      queryClient.invalidateQueries({ queryKey: ['hostBlockedDates', property._id] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update availability');
    }
  };

  return (
    <article className="host-listing-card">
      {property.images?.[0] ? (
        <img src={getImageUrl(property.images[0])} alt="" loading="lazy" />
      ) : (
        <div className="host-listing-placeholder"><MapPin size={22} /></div>
      )}
      <div className="host-listing-details">
        <div className="host-listing-title-row">
          <div><h3>{property.title}</h3><p>{property.location}</p></div>
          <span className={`listing-status status-${property.approvalStatus}`}>{property.approvalStatus}</span>
        </div>
        <p className="home-price"><strong>${Number(property.price).toLocaleString()}</strong> <span>/ night</span></p>
        <div className="host-listing-actions">
          <button className="subtle-action" type="button" onClick={() => setIsEditing(value => !value)}>
            {isEditing ? 'Cancel edit' : 'Edit details'}
          </button>
        <button className="subtle-action" type="button" onClick={toggleActive}>
          {property.isActive ? 'Pause listing' : 'Activate listing'}
        </button>
          <button className="subtle-action host-delete-action" type="button" onClick={deleteListing}>Remove</button>
        </div>
        {isEditing && (
          <form className="listing-edit-form" onSubmit={updateListing}>
            <label>Title<input name="title" defaultValue={property.title} minLength="3" maxLength="120" required /></label>
            <label>Description<textarea name="description" defaultValue={property.description} minLength="10" maxLength="5000" required /></label>
            <label>Price per night<input name="price" type="number" defaultValue={property.price} min="1" step="1" required /></label>
            <button type="submit">Save changes</button>
          </form>
        )}
        <form className="block-dates-form" onSubmit={blockDates}>
          <label><CalendarDays size={15} /> Block dates</label>
          <div>
            <input aria-label="Block from" type="date" value={start} onChange={event => setStart(event.target.value)} required />
            <input aria-label="Block until" type="date" value={end} onChange={event => setEnd(event.target.value)} required />
            <button type="submit">Save dates</button>
          </div>
        </form>
        {blockedDates.data?.length > 0 && (
          <ul className="blocked-date-list">
            {blockedDates.data.map(blockedDate => (
              <li key={blockedDate._id}>
                <span>{new Date(blockedDate.start).toLocaleDateString()} – {new Date(blockedDate.end).toLocaleDateString()}</span>
                <button type="button" onClick={() => removeBlockedDate(blockedDate._id)}>Unblock</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function HostDashboard() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const overview = useQuery({
    queryKey: ['hostOverview'],
    queryFn: () => api.get('/host/overview').then(response => response.data.data.analytics),
  });
  const listings = useQuery({
    queryKey: ['hostProperties'],
    queryFn: () => api.get('/properties/mine').then(response => response.data.data),
  });
  const bookings = useQuery({
    queryKey: ['hostBookings'],
    queryFn: () => api.get('/host/bookings').then(response => response.data.data),
  });
  const stats = overview.data || {};

  const decideBooking = async (bookingId, status) => {
    try {
      await api.patch(`/host/bookings/${bookingId}/status`, { status });
      toast.success(status === 'confirmed' ? 'Booking confirmed' : status === 'completed' ? 'Stay marked complete' : 'Booking declined');
      queryClient.invalidateQueries({ queryKey: ['hostBookings'] });
      queryClient.invalidateQueries({ queryKey: ['hostOverview'] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update booking');
    }
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link className="auth-brand auth-brand-dark" to="/">
          <span className="brand-mark"><MapPin size={18} strokeWidth={2.5} /></span>
          <span>NEST<span className="brand-accent">RIVO</span></span>
        </Link>
        <DashboardSwitcher user={user} active="host" />
      </header>
      <section className="dashboard-content host-dashboard-content">
        <p className="eyebrow login-eyebrow">WELCOME, {user?.hostProfile?.displayName || user?.name}</p>
        <h1 className="dashboard-title">Host dashboard</h1>
        <p className="dashboard-intro">Your guest account is still active. Switch dashboards whenever you need to.</p>
        <div className="dashboard-quick-links">
          <Link to="/#stays">Explore homes</Link>
        </div>

        <div className="host-stats-grid">
          <article className="stat-card"><span className="stat-icon"><MapPin size={17} /></span><span className="stat-label">Your listings</span><strong className="stat-value">{stats.totalListings ?? '—'}</strong></article>
          <article className="stat-card"><span className="stat-icon"><CalendarDays size={17} /></span><span className="stat-label">Upcoming bookings</span><strong className="stat-value">{stats.upcomingBookings ?? '—'}</strong></article>
          <article className="stat-card"><span className="stat-icon"><Wallet size={17} /></span><span className="stat-label">Completed-stay earnings</span><strong className="stat-value">${Number(stats.earnings || 0).toFixed(2)}</strong></article>
        </div>

        <div className="dashboard-section-heading">
          <div><h2>Your listings</h2><p>Listings stay attached to your existing user account.</p></div>
          <Link className="add-listing-button" to="/host/properties/new"><Plus size={16} /> Add a home</Link>
        </div>
        {listings.isLoading && <div className="dashboard-state">Loading your listings…</div>}
        {listings.isError && <div className="dashboard-state dashboard-error">Could not load your listings.</div>}
        {listings.data?.length === 0 && <div className="dashboard-state">You haven’t listed a home yet. Add one to get started.</div>}
        {listings.data?.length > 0 && (
          <div className="host-listings">
            {listings.data.map(property => (
              <ListingCard
                key={property._id}
                property={property}
                onUpdated={() => queryClient.invalidateQueries({ queryKey: ['hostProperties'] })}
              />
            ))}
          </div>
        )}

        <div className="dashboard-section-heading host-bookings-heading"><div><h2>Guest bookings</h2><p>Respond to booking requests for your homes.</p></div></div>
        {bookings.isLoading && <div className="dashboard-state">Loading bookings…</div>}
        {bookings.isError && <div className="dashboard-state dashboard-error">Could not load bookings.</div>}
        {bookings.data?.length === 0 && <div className="dashboard-state">No guest bookings yet.</div>}
        {bookings.data?.map(booking => (
          <article className="host-booking-row" key={booking._id}>
            <div>
              <strong>{booking.property?.title || 'Your property'}</strong>
              <p>{booking.guest?.name || 'Guest'} · {new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}</p>
            </div>
            <span className={`listing-status status-${booking.status}`}>{booking.status}</span>
            {booking.status === 'pending' && (
              <div className="booking-actions">
                <button type="button" onClick={() => decideBooking(booking._id, 'confirmed')}>Confirm</button>
                <button type="button" onClick={() => decideBooking(booking._id, 'rejected')}>Decline</button>
              </div>
            )}
            {booking.status === 'confirmed' && new Date(booking.checkOut) <= new Date() && (
              <div className="booking-actions">
                <button type="button" onClick={() => decideBooking(booking._id, 'completed')}>Mark completed</button>
              </div>
            )}
          </article>
        ))}
        <p className="dashboard-footnote">Earnings shown are based on completed stays; payment processing is not configured.</p>
      </section>
    </main>
  );
}
