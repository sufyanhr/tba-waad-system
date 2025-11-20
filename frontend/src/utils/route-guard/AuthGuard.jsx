import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// project imports
import Loader from 'components/Loader';
import { useAuth } from 'modules/auth/useAuth';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait until auth initialization completes before redirecting
    if (!loading && !isAuthenticated) {
      navigate('/auth/login', {
        state: {
          from: location.pathname
        },
        replace: true
      });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Show loader while checking auth
  if (loading) {
    return <Loader />;
  }

  return children;
}

AuthGuard.propTypes = { children: PropTypes.any };
