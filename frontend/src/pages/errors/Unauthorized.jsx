import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '70vh', p: 2 }}>
      <Paper elevation={3} sx={{ maxWidth: 600, width: '100%', p: 6, textAlign: 'center' }}>
        <Typography variant="h2" color="error" gutterBottom>
          403 – Unauthorized Access
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          You do not have the required role or permission to view this page. If you believe this is an error,
          please contact your system administrator.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard/default')}>
          Back to Dashboard
        </Button>
      </Paper>
    </Stack>
  );
}

