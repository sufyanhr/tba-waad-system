import { Typography, Stack, Link } from '@mui/material';

const AuthFooter = () => {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} TBA WAAD System
      </Typography>
      <Stack direction="row" spacing={2}>
        <Link href="#" variant="body2" underline="hover">Privacy</Link>
        <Link href="#" variant="body2" underline="hover">Terms</Link>
      </Stack>
    </Stack>
  );
};

export default AuthFooter;
