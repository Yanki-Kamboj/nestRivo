import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function DashboardSwitcher({ user, active }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const capabilities = user?.roles || [];
  const hostSuspended = user?.hostProfile?.status === 'suspended';
  const canHost = !hostSuspended && (capabilities.includes('host') || user?.role === 'host');
  const signOut = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch {
      // AuthContext reports logout errors to the user.
    }
  };

  return (
    <nav className="dashboard-switcher" aria-label="Dashboard">
      <Link className={active === 'guest' ? 'dashboard-switch-active' : ''} to="/dashboard">
        Guest
      </Link>
      {canHost ? (
        <Link className={active === 'host' ? 'dashboard-switch-active' : ''} to="/host/dashboard">
          Host
        </Link>
      ) : !hostSuspended ? (
        <Link className="dashboard-switch-host" to="/host/onboarding">Become a host</Link>
      ) : null}
      <button className="dashboard-switch-logout" type="button" onClick={signOut}>Log out</button>
    </nav>
  );
}
