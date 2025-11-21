import { Box } from '@mui/material';

// ==============================|| DRAWER ||============================== //

const Drawer = () => {
  return (
    <Box
      component="nav"
      sx={{
        width: 260,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      {/* Drawer content will be added later */}
    </Box>
  );
};

export default Drawer;
