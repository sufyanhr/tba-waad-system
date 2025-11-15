// pages/errors/Forbidden.jsx
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';

const Forbidden = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <MainCard>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 4
          }}
        >
          <Typography variant="h1" color="error" sx={{ fontSize: '4rem', fontWeight: 'bold', mb: 2 }}>
            403
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            You do not have the required permissions to access this resource.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleGoHome}>
            Go Home
          </Button>
        </Box>
      </MainCard>
    </Container>
  );
};

export default Forbidden;