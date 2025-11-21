import PropTypes from 'prop-types';
import { SnackbarProvider } from 'notistack';

// ==============================|| NOTISTACK - CONFIGURATION ||============================== //

const Notistack = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

Notistack.propTypes = {
  children: PropTypes.node
};

export default Notistack;
