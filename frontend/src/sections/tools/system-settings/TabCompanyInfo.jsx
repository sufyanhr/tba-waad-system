// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| SYSTEM SETTINGS - COMPANY INFO ||============================== //

export default function TabCompanyInfo() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <MainCard title="Company Information">
          <Typography color="secondary">
            Company Information configuration placeholder
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
