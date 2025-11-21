import { Box } from '@mui/material';

// ==============================|| HORIZONTAL BAR ||============================== //

const HorizontalBar = () => {
  return (
    <Box
      component="nav"
      sx={{
        width: '100%',
        height: 64,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'fixed',
        top: 64,
        left: 0,
        zIndex: 1200
      }}
    >
      {/* Horizontal menu content will be added later */}
    </Box>
  );
};

export default HorizontalBar;
