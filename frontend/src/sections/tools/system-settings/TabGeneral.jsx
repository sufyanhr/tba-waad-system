// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| SYSTEM SETTINGS - GENERAL ||============================== //

export default function TabGeneral() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <MainCard title="General Settings">
          <Typography color="secondary">
            General Settings configuration placeholder
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
