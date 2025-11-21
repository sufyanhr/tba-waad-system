import { AppBar, Toolbar, Typography, Box } from '@mui/material';

// ==============================|| HEADER ||============================== //

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1201,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none'
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TBA WAAD System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Header content will be added later */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
