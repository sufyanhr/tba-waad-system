import PropTypes from 'prop-types';
import { useEffect } from 'react';

// ==============================|| RTL LAYOUT ||============================== //

const RTLLayout = ({ children }) => {
  useEffect(() => {
    document.dir = 'ltr'; // Default to LTR, can be changed based on locale
  }, []);

  return <>{children}</>;
};

RTLLayout.propTypes = {
  children: PropTypes.node
};

export default RTLLayout;
