import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import axiosClient from 'api/axiosClient';
import toast from 'react-hot-toast';

const SystemTools = () => {
  const [loading, setLoading] = useState(false);
  const handleReset = async () => {
    setLoading(true);
    try {
      await axiosClient.delete('/admin/system/reset');
      toast.success('Reset request sent');
    } catch (e) {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p:3 }}>
      <Stack spacing={2}>
        <Typography variant="h5">System Tools</Typography>
        <Typography variant="body2">Utility actions for administrators.</Typography>
        <Button variant="contained" color="warning" disabled={loading} onClick={handleReset}>Reset Test Data</Button>
        <Typography variant="caption" color="text.secondary">Endpoint: DELETE /api/admin/system/reset (pending backend implementation)</Typography>
      </Stack>
    </Paper>
  );
};

export default SystemTools;
