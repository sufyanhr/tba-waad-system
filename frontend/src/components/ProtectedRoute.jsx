// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'modules/auth/useAuth';
import Loader from 'components/Loader';

const ProtectedRoute = ({ children, roles = [], permissions = [] }) => {
  const { user, isAuthenticated, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Wait for auth to initialize
  if (user === undefined) {
    return <Loader />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If no roles or permissions specified, allow access
  if (roles.length === 0 && permissions.length === 0) {
    return children;
  }

  // Check roles and permissions
  const hasRequiredRole = roles.length > 0 ? roles.some(role => hasRole(role)) : false;
  const hasRequiredPermission = permissions.length > 0 ? permissions.some(perm => hasPermission(perm)) : false;

  // Allow access if user has any required role OR any required permission
  if (hasRequiredRole || hasRequiredPermission) {
    return children;
  }

  // If no required permissions, redirect to forbidden page
  return <Navigate to="/maintenance/403" replace />;
};

export default ProtectedRoute;