// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from 'modules/auth/useAuth';
import Loader from 'components/Loader';

export default function ProtectedRoute({ children, roles = [], permissions = [] }) {
  const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/auth/login" state={{ from: location }} replace />;

  // Grant access if any required role OR any required permission is satisfied
  const hasAnyRole = roles.length === 0 || roles.some((r) => hasRole(r));
  const hasAnyPerm = permissions.length === 0 || permissions.some((p) => hasPermission(p));

  if (hasAnyRole || hasAnyPerm) return children;

  return <Navigate to="/unauthorized" replace />;
}
