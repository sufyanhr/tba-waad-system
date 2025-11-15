// components/auth/PermissionGuard.jsx
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';

const PermissionGuard = ({ children, roles = [], permissions = [] }) => {
  const { hasAnyRole, hasAnyPermission } = useAuth();

  // If no roles or permissions specified, allow access
  if (roles.length === 0 && permissions.length === 0) {
    return children;
  }

  // Check if user has any required role OR any required permission
  const hasRequiredRole = roles.length > 0 ? hasAnyRole(roles) : false;
  const hasRequiredPermission = permissions.length > 0 ? hasAnyPermission(permissions) : false;

  // Allow access if user has any required role OR any required permission
  if (hasRequiredRole || hasRequiredPermission) {
    return children;
  }

  // Deny access
  return null;
};

PermissionGuard.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  permissions: PropTypes.arrayOf(PropTypes.string)
};

export default PermissionGuard;