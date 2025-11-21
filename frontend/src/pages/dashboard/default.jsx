import { Grid, Typography, Box } from '@mui/material';
import MainCard from 'components/MainCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const DashboardDefault = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to TBA WAAD System
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MainCard>
          <Typography variant="h6">Total Users</Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>1,234</Typography>
        </MainCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MainCard>
          <Typography variant="h6">Active Sessions</Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>567</Typography>
        </MainCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MainCard>
          <Typography variant="h6">Pending Tasks</Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>89</Typography>
        </MainCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MainCard>
          <Typography variant="h6">Completed</Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>432</Typography>
        </MainCard>
      </Grid>

      <Grid item xs={12}>
        <MainCard>
          <Typography variant="h5" gutterBottom>
            Recent Activity
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Dashboard content will be populated with TBA-specific data...
            </Typography>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
