import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '70vh', p: 2 }}>
      <Paper elevation={4} sx={{ maxWidth: 640, width: '100%', p: 6, textAlign: 'center' }}>
        <Typography variant="h1" color="error" gutterBottom>404</Typography>
        <Typography variant="h5" gutterBottom>Page not found</Typography>
        <Typography variant="body2" sx={{ mb: 4 }}>
          The page you are looking for doesn't exist or has been moved. Check the URL or return to the dashboard.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard/default')}>Back to Dashboard</Button>
      </Paper>
    </Stack>
  );
}

