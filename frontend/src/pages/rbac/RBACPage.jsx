import { Box, Typography, Paper, Grid } from '@mui/material';

const RBACPage = () => {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        RBAC Management
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Role-Based Access Control - Manage roles, permissions, and user access
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Roles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage system roles and their permissions (Phase F will connect to API)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Permissions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure access permissions for different modules (Phase F will connect to API)
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RBACPage;
