import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';

// ==============================|| RBAC GUARD ||============================== //

const RBACGuard = ({ permission, children, fallback }) => {
  const { hasPermission, isLoggedIn } = useAuth();

  // If not logged in, don't show content
  if (!isLoggedIn) {
    return null;
  }

  // If no permission required, show content
  if (!permission) {
    return <>{children}</>;
  }

  // Check permission with backend-provided user permissions
  if (!hasPermission(permission)) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Access Denied
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          You don't have permission to access this resource.
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
          Required: {permission}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

RBACGuard.propTypes = {
  permission: PropTypes.string,
  children: PropTypes.node,
  fallback: PropTypes.node
};

export default RBACGuard;
