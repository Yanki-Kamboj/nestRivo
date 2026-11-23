import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, MapPin, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Use at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export default function Signup() {
  const { register: createAccount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ name, email, password }) => {
    try {
      await createAccount({ name, email, password });
      navigate('/login', { replace: true });
    } catch {
      // AuthContext reports the request error to the user.
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Nest Rivo">
        <div className="auth-visual-image" />
        <div className="auth-brand auth-brand-light">
          <span className="brand-mark"><MapPin size={19} strokeWidth={2.5} /></span>
          <span>NEST<span className="brand-accent">RIVO</span></span>
        </div>
        <div className="visual-copy">
          <span className="eyebrow"><UserRound size={14} /> A LITTLE MORE ROOM TO FEEL AT HOME</span>
          <h1>Make room<br />for <em>somewhere.</em></h1>
          <p>Join a community finding thoughtful stays and memorable places.</p>
        </div>
        <div className="visual-caption">
          <span className="caption-dot" />
          <span>Somewhere between away and at home.</span>
        </div>
      </section>

      <section className="auth-content">
        <Link className="auth-brand auth-brand-dark" to="/" aria-label="Nest Rivo home">
          <span className="brand-mark"><MapPin size={18} strokeWidth={2.5} /></span>
          <span>NEST<span className="brand-accent">RIVO</span></span>
        </Link>
        <div className="login-card signup-card">
          <div className="login-icon"><UserRound size={20} /></div>
          <p className="eyebrow login-eyebrow">YOUR NEXT CHAPTER</p>
          <h2>Create your account</h2>
          <p className="login-intro">Sign up as a guest to save your place for the next adventure.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="field-group">
              <label htmlFor="name">Your name</label>
              <input id="name" type="text" autoComplete="name" placeholder="How should we call you?" aria-invalid={Boolean(errors.name)} {...register('name')} />
              {errors.name && <p className="field-error">{errors.name.message}</p>}
            </div>
            <div className="field-group">
              <label htmlFor="signup-email">Email address</label>
              <input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} {...register('email')} />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>
            <div className="field-group">
              <label htmlFor="signup-password">Password</label>
              <div className="password-field">
                <input id="signup-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 6 characters" aria-invalid={Boolean(errors.password)} {...register('password')} />
                <button className="password-toggle" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>
            <div className="field-group">
              <label htmlFor="confirm-password">Confirm password</label>
              <input id="confirm-password" type="password" autoComplete="new-password" placeholder="Enter your password again" aria-invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
            </div>
            <button className="sign-in-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : <>Create account <ArrowRight size={17} /></>}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
          <p className="auth-switch"><Link to="/">Back to browsing homes</Link></p>
        </div>
        <p className="auth-footer">© {new Date().getFullYear()} NEST RIVO <span>·</span> A little closer to feeling at home.</p>
      </section>
    </main>
  );
}
