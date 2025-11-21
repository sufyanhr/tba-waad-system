import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';

// ==============================|| PROTECTED ROUTE ||============================== //

export default function ProtectedRoute({ children, requiredPermissions = [], requiredRoles = [], requireAll = false }) {
  const { isLoggedIn, hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login', {
        state: {
          from: location.pathname
        },
        replace: true
      });
    }
  }, [isLoggedIn, navigate, location]);

  // If not logged in, don't render anything
  if (!isLoggedIn) {
    return null;
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every((permission) => hasPermission(permission))
      : requiredPermissions.some((permission) => hasPermission(permission));

    if (!hasRequiredPermissions) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography variant="h1" color="error">
              403
            </Typography>
            <Typography variant="h4">Access Denied</Typography>
            <Typography variant="body1" color="textSecondary" textAlign="center" sx={{ maxWidth: 400 }}>
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard/default')}>
              Go to Dashboard
            </Button>
          </Stack>
        </Box>
      );
    }
  }

  // Check roles
  if (requiredRoles.length > 0) {
    const hasRequiredRoles = requireAll
      ? requiredRoles.every((role) => hasRole(role))
      : requiredRoles.some((role) => hasRole(role));

    if (!hasRequiredRoles) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography variant="h1" color="error">
              403
            </Typography>
            <Typography variant="h4">Access Denied</Typography>
            <Typography variant="body1" color="textSecondary" textAlign="center" sx={{ maxWidth: 400 }}>
              Your role does not have access to this page. Please contact your administrator if you believe this is an error.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard/default')}>
              Go to Dashboard
            </Button>
          </Stack>
        </Box>
      );
    }
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.any,
  requiredPermissions: PropTypes.array,
  requiredRoles: PropTypes.array,
  requireAll: PropTypes.bool
};
