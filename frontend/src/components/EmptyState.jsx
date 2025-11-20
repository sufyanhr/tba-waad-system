import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
      <Stack sx={{ gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
        {actionLabel && <Button variant="contained" size="small" onClick={onAction}>{actionLabel}</Button>}
      </Stack>
    </Paper>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func
};

