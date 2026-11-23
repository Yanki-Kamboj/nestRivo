import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Protects any route that requires authentication
const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) {
    // redirect to login preserving intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
