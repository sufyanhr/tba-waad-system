import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

// ==============================|| SIMPLE LAYOUT ||============================== //

const SimpleLayout = ({ layout = 'simple', enableElevationScroll = false }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Outlet />
    </Box>
  );
};

SimpleLayout.propTypes = {
  layout: PropTypes.string,
  enableElevationScroll: PropTypes.bool
};

export default SimpleLayout;
