import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ==============================|| NAVIGATION - SCROLL TO TOP ||============================== //

/**
 * ScrollTop - Scrolls window to top on route change
 * SAFE: Only used inside RouterProvider context
 * React 18 StrictMode compatible
 */
const ScrollTop = ({ children }) => {
  let location;
  
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    location = useLocation();
  } catch (error) {
    // If Router context not available, just return children
    console.warn('ScrollTop: useLocation() failed - Router context not available');
    return children || null;
  }

  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return children || null;
};

ScrollTop.propTypes = {
  children: PropTypes.node
};

export default ScrollTop;
