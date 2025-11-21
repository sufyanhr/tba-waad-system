import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';

const SimpleBar = ({ children, ...other }) => {
  return <SimpleBarReact {...other}>{children}</SimpleBarReact>;
};

SimpleBar.propTypes = {
  children: PropTypes.node
};

export default SimpleBar;
