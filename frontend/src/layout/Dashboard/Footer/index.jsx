import { Box, Typography, Link, Stack } from '@mui/material';

// ==============================|| FOOTER ||============================== //

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} TBA WAAD System. All rights reserved.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Link href="#" underline="hover" color="text.secondary" variant="body2">
            Privacy
          </Link>
          <Link href="#" underline="hover" color="text.secondary" variant="body2">
            Terms
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
