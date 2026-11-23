import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PropertyDetails from './pages/PropertyDetails';
import GuestOverview from './pages/GuestDashboard/Overview.jsx';
import GuestReservations from './pages/GuestReservations';
import GuestWishlist from './pages/GuestWishlist';
import HostDashboard from './pages/HostDashboard';
import HostOnboarding from './pages/HostOnboarding';
import HostPropertyForm from './pages/HostPropertyForm';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleRoute from './components/RoleRoute.jsx';

// Simple 404 component
const NotFound = () => (
  <div className="flex h-screen items-center justify-center">
    <h1 className="text-2xl font-bold">404 – Page Not Found</h1>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/properties/:propertyId" element={<PropertyDetails />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<GuestOverview />} />
          <Route path="/dashboard/reservations" element={<GuestReservations />} />
          <Route path="/dashboard/wishlist" element={<GuestWishlist />} />
          <Route path="/host/onboarding" element={<HostOnboarding />} />
          <Route element={<RoleRoute allowedRoles={['host']} />}>
            <Route path="/host/dashboard" element={<HostDashboard />} />
            <Route path="/host/properties/new" element={<HostPropertyForm />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
