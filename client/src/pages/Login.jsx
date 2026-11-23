import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, KeyRound, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async data => {
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
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
          <span className="eyebrow"><Sparkles size={14} /> YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Find a place<br />to <em>belong.</em></h1>
          <p>Thoughtful stays, memorable places, and a little more room to feel at home.</p>
        </div>
        <div className="visual-caption">
          <span className="caption-dot" />
          <span>Somewhere between away and at home.</span>
        </div>
      </section>

      <section className="auth-content">
        <div className="auth-brand auth-brand-dark">
          <span className="brand-mark"><MapPin size={18} strokeWidth={2.5} /></span>
          <span>NEST<span className="brand-accent">RIVO</span></span>
        </div>
        <div className="login-card">
          <div className="login-icon"><KeyRound size={20} /></div>
          <p className="eyebrow login-eyebrow">WELCOME BACK</p>
          <h2>Sign in to your account</h2>
          <p className="login-intro">Pick up right where your next journey begins.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email && <p className="field-error" id="email-error">{errors.email.message}</p>}
            </div>
            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="password">Password</label>
              </div>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(value => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="field-error" id="password-error">{errors.password.message}</p>}
            </div>
            <button className="sign-in-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : <>Sign in <ArrowRight size={17} /></>}
            </button>
          </form>
          <div className="secure-note"><ShieldCheck size={16} /> Your stay and your details are in safe hands.</div>
          <p className="auth-switch">New to NEST RIVO? <Link to="/signup">Create an account</Link></p>
          <p className="auth-switch"><Link to="/">Browse homes without an account</Link></p>
        </div>
        <p className="auth-footer">© {new Date().getFullYear()} NEST RIVO <span>·</span> A little closer to feeling at home.</p>
      </section>
    </main>
  );
}
