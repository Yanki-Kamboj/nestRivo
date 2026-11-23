import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircleCheck, Home, MapPin, MoveUpRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import DashboardSwitcher from '../../components/DashboardSwitcher';
import { AuthContext } from '../../context/AuthContext';

export default function GuestOverview() {
  const { user } = useContext(AuthContext);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['guestOverview'],
    queryFn: () => api.get('/dashboard/guest/stats').then(res => res.data),
  });

  if (isLoading) {
    return <main className="dashboard-page"><div className="dashboard-state">Loading your overview…</div></main>;
  }
  if (isError) {
    return <main className="dashboard-page"><div className="dashboard-state dashboard-error">We couldn’t load your overview. Please try again later.</div></main>;
  }

  const { totalBookings, upcoming, past, cancelled, totalSpent } = data?.data || {};
  const stats = [
    { label: 'Total bookings', value: totalBookings ?? 0, detail: 'All your stays', icon: Home },
    { label: 'Upcoming', value: upcoming ?? 0, detail: 'On the horizon', icon: MoveUpRight },
    { label: 'Past stays', value: past ?? 0, detail: 'Memories made', icon: CircleCheck },
    { label: 'Cancelled', value: cancelled ?? 0, detail: 'Plans can change', icon: RotateCcw },
  ];

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="auth-brand auth-brand-dark">
          <span className="brand-mark"><MapPin size={18} strokeWidth={2.5} /></span>
          <span>NEST<span className="brand-accent">RIVO</span></span>
        </div>
        <DashboardSwitcher user={user} active="guest" />
      </header>
      <section className="dashboard-content">
        <p className="eyebrow login-eyebrow">YOUR JOURNEY, AT A GLANCE</p>
        <h1 className="dashboard-title">Your stays</h1>
        <p className="dashboard-intro">All the details of your time away, gathered in one place.</p>
        <div className="dashboard-quick-links">
          <Link to="/#stays">Explore homes</Link>
          <Link to="/dashboard/reservations">Your reservations</Link>
          <Link to="/dashboard/wishlist">Wishlist</Link>
        </div>
        <div className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span className="stat-icon" aria-hidden="true"><stat.icon size={17} /></span>
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
              <span className="stat-detail">{stat.detail}</span>
            </article>
          ))}
          <article className="stat-card spending-card">
            <span className="stat-label">Total spent</span>
            <strong className="stat-value">${Number(totalSpent || 0).toFixed(2)}</strong>
            <span className="stat-detail">Across all your bookings</span>
          </article>
        </div>
      </section>
    </main>
  );
}
