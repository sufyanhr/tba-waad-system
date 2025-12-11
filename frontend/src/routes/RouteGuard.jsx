import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useRBAC } from 'api/rbac';

// ==============================|| ROUTE GUARD - RBAC PROTECTION - FIXED ||============================== //

/**
 * RouteGuard Component (FIXED)
 * Protects routes based on user roles (RBAC)
 * 
 * CRITICAL FIXES:
 * 1. Never return null (causes blank screen)
 * 2. Show proper loading state during RBAC initialization
 * 3. Add console logs for debugging
 * 4. Handle all edge cases
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of role names that can access this route
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @returns {React.ReactNode}
 */
const RouteGuard = ({ allowedRoles = [], children }) => {
  const { roles, isInitialized, isSuperAdmin } = useRBAC();

  // FIX #1: Show loading spinner instead of null
  if (!isInitialized) {
    console.log('🔄 RouteGuard: Waiting for RBAC initialization...');
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // FIX #2: Check for empty roles (not logged in)
  if (!roles || roles.length === 0) {
    console.warn('🚫 RouteGuard: No roles found (user not logged in), redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // SUPER_ADMIN BYPASS: Full unrestricted access
  if (isSuperAdmin) {
    console.log('👑 RouteGuard: SUPER_ADMIN detected - Bypassing all checks');
    return children;
  }

  // FIX #3: If no specific roles required, allow access (authenticated route)
  if (!allowedRoles || allowedRoles.length === 0) {
    console.log('✅ RouteGuard: No specific roles required, access granted');
    return children;
  }

  // FIX #4: Check if user has any of the required roles
  const hasAccess = roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    console.warn('🚫 RouteGuard: Access denied. User roles:', roles, 'Required:', allowedRoles);
    return <Navigate to="/403" replace />;
  }

  // FIX #5: User has valid role, render protected component
  console.log('✅ RouteGuard: Access granted. User roles:', roles);
  return children;
};

export default RouteGuard;
