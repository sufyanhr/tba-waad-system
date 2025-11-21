import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

// ==============================|| LANDING PAGE ||============================== //

const Landing = () => {
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
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h1" gutterBottom>
          TBA WAAD System
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Welcome to the TBA WAAD Management System
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button component={Link} to="/dashboard/default" variant="contained" size="large">
            Go to Dashboard
          </Button>
          <Button component={Link} to="/auth/login" variant="outlined" size="large">
            Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
