import { Box, CircularProgress } from '@mui/material';

// ==============================|| LOADER ||============================== //

const Loader = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1301,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    }}
  >
    <CircularProgress />
  </Box>
);

export default Loader;
