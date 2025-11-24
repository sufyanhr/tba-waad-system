// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| SYSTEM SETTINGS - AUDIT LOG ||============================== //

export default function TabAuditLog() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <MainCard title="Audit Log">
          <Typography color="secondary">
            Audit Log configuration placeholder
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
