import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import axios from 'utils/axios';
import Loader from 'components/Loader';

/**
 * RoleGuard Component
 * Phase B2 - Route Protection with RBAC + Feature Toggles
 * 
 * Protects routes based on:
 * 1. User authentication (must be logged in)
 * 2. Required roles (user must have at least one of the specified roles)
 * 3. Required permissions (user must have at least one of the specified permissions)
 * 4. Feature toggles (for EMPLOYER_ADMIN only - checks backend feature settings)
 * 
 * Usage:
 * <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_MEMBERS']}>
 *   <MembersPage />
 * </RoleGuard>
 * 
 * With feature toggle:
 * <RoleGuard 
 *   roles={['SUPER_ADMIN', 'EMPLOYER_ADMIN']} 
 *   featureToggle="canViewClaims"
 * >
 *   <ClaimsPage />
 * </RoleGuard>
 */
export default function RoleGuard({ 
  children, 
  roles = [], 
  permissions = [], 
  featureToggle = null 
}) {
  const { isLoggedIn, user, roles: userRoles, hasRole, hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasFeatureAccess, setHasFeatureAccess] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Step 1: Authentication check
      if (!isLoggedIn || !user) {
        setLoading(false);
        return;
      }

      // Step 2: Role check (if roles specified)
      if (roles.length > 0) {
        const hasRequiredRole = roles.some(role => hasRole(role));
        if (!hasRequiredRole) {
          setLoading(false);
          setHasFeatureAccess(false);
          return;
        }
      }

      // Step 3: Permission check (if permissions specified)
      if (permissions.length > 0) {
        const hasRequiredPermission = permissions.some(perm => hasPermission(perm));
        if (!hasRequiredPermission) {
          setLoading(false);
          setHasFeatureAccess(false);
          return;
        }
      }

      // Step 4: Feature toggle check (for EMPLOYER_ADMIN only)
      if (featureToggle && hasRole('EMPLOYER_ADMIN')) {
        try {
          const employerId = user?.employerId;
          
          if (!employerId) {
            // If no employerId, deny access
            setHasFeatureAccess(false);
            setLoading(false);
            return;
          }

          // Fetch feature toggles from backend
          const response = await axios.get(`/company-settings/employer/${employerId}`);
          const featureToggles = response.data.data || response.data;

          // Check if the specific feature is enabled
          if (featureToggles[featureToggle] === false) {
            setHasFeatureAccess(false);
          }
        } catch (error) {
          console.error('Error fetching feature toggles:', error);
          // On error, deny access to be safe
          setHasFeatureAccess(false);
        }
      }

      setLoading(false);
    };

    checkAccess();
  }, [isLoggedIn, user, roles, permissions, featureToggle, hasRole, hasPermission, userRoles]);

  // Show loading spinner while checking permissions
  if (loading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to 403 if role/permission/feature check failed
  if (!hasFeatureAccess) {
    return <Navigate to="/403" replace />;
  }

  // Grant access - render children
  return <>{children}</>;
}

RoleGuard.propTypes = {
  children: PropTypes.node,
  roles: PropTypes.arrayOf(PropTypes.string),
  permissions: PropTypes.arrayOf(PropTypes.string),
  featureToggle: PropTypes.string
};

/**
 * Higher-order component wrapper for easier usage
 * 
 * Usage:
 * export default requireRole(['SUPER_ADMIN'])(MembersPage);
 */
export function requireRole(roles = [], permissions = [], featureToggle = null) {
  return function (Component) {
    return function WrappedComponent(props) {
      return (
        <RoleGuard roles={roles} permissions={permissions} featureToggle={featureToggle}>
          <Component {...props} />
        </RoleGuard>
      );
    };
  };
}
