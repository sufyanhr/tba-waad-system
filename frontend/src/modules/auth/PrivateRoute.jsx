import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from 'modules/auth/useAuth';
import CircularLoader from 'components/CircularLoader';

export default function PrivateRoute({ children, requiredRole, requiredPermission }) {
  const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();

  if (loading) {
    return <CircularLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
  requiredPermission: PropTypes.string
};
