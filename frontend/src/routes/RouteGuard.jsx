import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from 'contexts/JWTContext';

// ==============================|| SIMPLIFIED ROUTE GUARD ||============================== //

/**
 * RouteGuard Component - SIMPLIFIED
 *
 * Simplified Rules:
 * 1. Check if user is authenticated
 * 2. If allowedRoles specified, check if user's role is in the list
 * 3. Frontend only hides/shows - Backend is the authority
 * 4. Never return null (prevents blank screens)
 * 5. Each user has ONE primary role (first role in array)
 *
 * @param {Object} props
 * @param {string[]|null} props.allowedRoles - Array of allowed role names (optional)
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @returns {React.ReactNode}
 */
const RouteGuard = ({ allowedRoles = null, children }) => {
  const { isLoggedIn, isInitialized, user } = useAuth();

  // Loading state during initialization
  if (!isInitialized) {
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

  // Not authenticated - redirect to login
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Get user's primary role (users have ONE role)
  const userRole = user.roles?.[0] || null;

  if (!userRole) {
    // User has no role - redirect to forbidden
    return <Navigate to="/403" replace />;
  }

  // SUPER_ADMIN has unrestricted access
  if (userRole === 'SUPER_ADMIN') {
    return children;
  }

  // If no specific roles required, only authentication check needed
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  // Simple check: is user's role in allowed list?
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return <Navigate to="/403" replace />;
  }

  // Access granted
  return children;
};

export default RouteGuard;
