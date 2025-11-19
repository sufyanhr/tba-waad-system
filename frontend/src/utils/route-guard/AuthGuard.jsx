import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// project imports
import Loader from 'components/Loader';
import { useAuth } from 'modules/auth/useAuth';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user !== undefined && !isAuthenticated) {
      navigate('/auth/login', {
        state: {
          from: location.pathname
        },
        replace: true
      });
    }
  }, [isAuthenticated, user, navigate, location]);

  // Show loader while checking auth
  if (user === undefined) {
    return <Loader />;
  }

  return children;
}

AuthGuard.propTypes = { children: PropTypes.any };
