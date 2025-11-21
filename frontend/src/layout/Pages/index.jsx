import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

// ==============================|| PAGES LAYOUT ||============================== //

const PagesLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="sm">
        <Outlet />
      </Container>
    </Box>
  );
};

export default PagesLayout;
