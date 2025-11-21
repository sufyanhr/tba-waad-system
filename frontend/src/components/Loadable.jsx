import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loader = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 2001,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }}
  >
    <CircularProgress />
  </Box>
);

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;
