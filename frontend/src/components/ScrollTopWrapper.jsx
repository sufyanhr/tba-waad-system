import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ==============================|| SCROLL TO TOP WRAPPER ||============================== //

/**
 * This component must be rendered INSIDE RouterProvider context
 * It automatically scrolls to top when route changes
 */
const ScrollTopWrapper = () => {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

export default ScrollTopWrapper;
