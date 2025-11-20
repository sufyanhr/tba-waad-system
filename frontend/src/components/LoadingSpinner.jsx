import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Stack sx={{ alignItems:'center', justifyContent:'center', py:6, gap:2 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Stack>
  );
}

LoadingSpinner.propTypes = { message: PropTypes.string };

