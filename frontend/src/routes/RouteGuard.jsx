import { Navigate } from 'react-router-dom';
import { useRBAC } from 'api/rbac';

// ==============================|| ROUTE GUARD - RBAC PROTECTION ||============================== //

/**
 * RouteGuard Component
 * Protects routes based on user roles (RBAC)
 * 
 * Usage:
 * <RouteGuard allowedRoles={['ADMIN', 'EMPLOYER']}>
 *   <YourComponent />
 * </RouteGuard>
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of role names that can access this route
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @returns {React.ReactNode}
 */
const RouteGuard = ({ allowedRoles = [], children }) => {
  const { roles, isInitialized } = useRBAC();

  // Wait for RBAC initialization
  if (!isInitialized) {
    return null; // or a loading spinner
  }

  // If no roles assigned, user is not logged in -> redirect to login
  if (!roles || roles.length === 0) {
    console.warn('🚫 RouteGuard: No roles found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If no roles specified, allow access (public route with auth)
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  // Check if user has any of the required roles
  const hasAccess = roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    console.warn('🚫 RouteGuard: Access denied. User roles:', roles, 'Required:', allowedRoles);
    return <Navigate to="/403" replace />;
  }

  // User has valid role, render protected component
  return children;
};

export default RouteGuard;
