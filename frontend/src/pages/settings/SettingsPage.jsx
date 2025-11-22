import { Box, Typography, Paper, Grid } from '@mui/material';

const SettingsPage = () => {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        System Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Configure system preferences and general settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              General Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              System configuration and preferences (Phase F will connect to API)
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
