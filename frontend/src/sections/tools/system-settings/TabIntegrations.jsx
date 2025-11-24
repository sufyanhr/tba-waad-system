// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| SYSTEM SETTINGS - INTEGRATIONS ||============================== //

export default function TabIntegrations() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <MainCard title="Integration Settings">
          <Typography color="secondary">
            Integration Settings configuration placeholder
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
