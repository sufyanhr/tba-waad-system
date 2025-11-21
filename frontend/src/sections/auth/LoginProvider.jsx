import PropTypes from 'prop-types';

const LoginProvider = ({ children }) => {
  return <>{children}</>;
};

LoginProvider.propTypes = {
  children: PropTypes.node
};

export default LoginProvider;
