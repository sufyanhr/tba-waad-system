import { Typography, Box } from '@mui/material';
const Error500 = () => (
  <Box sx={{ textAlign: 'center', py: 10 }}>
    <Typography variant="h1">500</Typography>
    <Typography variant="h4" sx={{ mt: 2 }}>Internal Server Error</Typography>
  </Box>
);
export default Error500;
