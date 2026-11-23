import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const schema = z.object({
  displayName: z.string().trim().min(2, 'Enter a public host name').max(80),
  phone: z.string().trim().min(7, 'Enter a contact number').max(30),
  bio: z.string().trim().max(500).optional(),
});

export default function HostOnboarding() {
  const { user, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.hostProfile?.displayName || user?.name || '',
      phone: user?.hostProfile?.phone || '',
      bio: user?.hostProfile?.bio || '',
    },
  });

  const onSubmit = async data => {
    try {
      await api.put('/host/onboarding', data);
      await refreshUser();
      toast.success('Your host profile is ready. It is still the same account.');
      navigate('/host/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save your host profile');
    }
  };

  return (
    <main className="onboarding-page">
      <header className="dashboard-header">
        <Link className="auth-brand auth-brand-dark" to="/">
          <span className="brand-mark"><MapPin size={18} strokeWidth={2.5} /></span>
          <span>NEST<span className="brand-accent">RIVO</span></span>
        </Link>
        <Link className="onboarding-back" to="/dashboard">Guest dashboard</Link>
      </header>
      <section className="onboarding-content">
        <p className="eyebrow login-eyebrow">ONE ACCOUNT, MORE POSSIBILITIES</p>
        <h1>Become a host</h1>
        <p className="dashboard-intro">Set up your host profile. Your guest account, bookings, and reviews stay right where they are.</p>
        <form className="onboarding-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field-group">
            <label htmlFor="host-display-name">Name guests will see</label>
            <input id="host-display-name" autoComplete="name" aria-invalid={Boolean(errors.displayName)} {...register('displayName')} />
            {errors.displayName && <p className="field-error">{errors.displayName.message}</p>}
          </div>
          <div className="field-group">
            <label htmlFor="host-phone">Contact phone</label>
            <input id="host-phone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} {...register('phone')} />
            {errors.phone && <p className="field-error">{errors.phone.message}</p>}
          </div>
          <div className="field-group">
            <label htmlFor="host-bio">A little about you <span>(optional)</span></label>
            <textarea id="host-bio" rows="4" maxLength="500" {...register('bio')} />
            {errors.bio && <p className="field-error">{errors.bio.message}</p>}
          </div>
          <div className="onboarding-assurance">Host capabilities are enabled on this account; guest access remains enabled too.</div>
          <button className="sign-in-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving host profile…' : <>Continue to host dashboard <ArrowRight size={17} /></>}
          </button>
        </form>
      </section>
    </main>
  );
}
