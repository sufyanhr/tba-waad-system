// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| SYSTEM SETTINGS - NOTIFICATIONS ||============================== //

export default function TabNotifications() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <MainCard title="Notification Settings">
          <Typography color="secondary">
            Notification Settings configuration placeholder
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
