import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project imports
import { APP_DEFAULT_PATH } from 'config';
import { useAuth } from 'modules/auth/useAuth';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(location?.state?.from ? location?.state?.from : APP_DEFAULT_PATH, {
        state: { from: '' },
        replace: true
      });
    }
  }, [isAuthenticated, loading, navigate, location]);

  return children;
}

GuestGuard.propTypes = { children: PropTypes.any };
