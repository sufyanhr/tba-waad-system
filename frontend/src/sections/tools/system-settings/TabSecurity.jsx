// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| SYSTEM SETTINGS - SECURITY ||============================== //

export default function TabSecurity() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <MainCard title="Security Settings">
          <Typography color="secondary">
            Security Settings configuration placeholder
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
