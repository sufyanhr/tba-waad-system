import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

// ==============================|| PROTECTED ROUTE ||============================== //

/**
 * ProtectedRoute - Component to protect routes based on user roles
 *
 * Usage examples:
 *
 * 1. Require ADMIN role only:
 *    <ProtectedRoute requiredRoles={['ADMIN']}>
 *      <AdminDashboard />
 *    </ProtectedRoute>
 *
 * 2. Require ANY of multiple roles (OR logic):
 *    <ProtectedRoute requiredRoles={['ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER']}>
 *      <ClaimsReview />
 *    </ProtectedRoute>
 *
 * 3. Require ALL roles (AND logic):
 *    <ProtectedRoute requiredRoles={['ADMIN']} requireAll>
 *      <SystemSettings />
 *    </ProtectedRoute>
 *
 * 4. Check for permission instead of role:
 *    <ProtectedRoute requiredPermissions={['WRITE_CLAIMS', 'APPROVE_CLAIMS']}>
 *      <ClaimApproval />
 *    </ProtectedRoute>
 */
const ProtectedRoute = ({ children, requiredRoles = [], requiredPermissions = [], requireAll = false, fallbackPath = '/unauthorized' }) => {
  const { isLoggedIn, hasAnyRole, hasAllRoles, hasPermission } = useAuth();

  // Not logged in - redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check roles if specified
  if (requiredRoles.length > 0) {
    const hasRequiredRoles = requireAll ? hasAllRoles(requiredRoles) : hasAnyRole(requiredRoles);

    if (!hasRequiredRoles) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // Check permissions if specified
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every((perm) => hasPermission(perm))
      : requiredPermissions.some((perm) => hasPermission(perm));

    if (!hasRequiredPermissions) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // User is authorized - render children
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  requiredPermissions: PropTypes.arrayOf(PropTypes.string),
  requireAll: PropTypes.bool,
  fallbackPath: PropTypes.string
};

export default ProtectedRoute;
