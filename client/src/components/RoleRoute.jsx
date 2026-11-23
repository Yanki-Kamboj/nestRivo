import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Restricts route based on allowed roles (e.g., ['admin','host'])
const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const capabilities = user.roles || [];
  const canHost = user.hostProfile?.status !== 'suspended' && (capabilities.includes('host') || user.role === 'host');
  const hasAccess = allowedRoles.some(role =>
    role === 'admin'
      ? user.isAdmin || user.role === 'admin'
      : role === 'host'
        ? canHost
        : capabilities.includes(role) || user.role === role
  );
  if (!hasAccess) {
    return <Navigate to={canHost ? '/host/dashboard' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
