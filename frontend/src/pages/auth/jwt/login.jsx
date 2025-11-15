import { Link, Navigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import LoginForm from './LoginForm';
import useAuth from 'hooks/useAuth';

export default function Login() {
  const { isLoggedIn } = useAuth();

  // If already logged in, redirect to dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard/default" replace />;
  }

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography variant="h3">Login</Typography>
            <Typography
              component={Link}
              to="/auth/register"
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Don't have an account?
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <LoginForm />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
