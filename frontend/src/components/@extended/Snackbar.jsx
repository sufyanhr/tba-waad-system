import { Alert, Snackbar as MuiSnackbar } from '@mui/material';
import { useState, useEffect } from 'react';

// ==============================|| SNACKBAR ||============================== //

const Snackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  useEffect(() => {
    // Listen for custom snackbar events
    const handleSnackbar = (event) => {
      setMessage(event.detail.message);
      setSeverity(event.detail.severity || 'info');
      setOpen(true);
    };

    window.addEventListener('showSnackbar', handleSnackbar);
    return () => window.removeEventListener('showSnackbar', handleSnackbar);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MuiSnackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
