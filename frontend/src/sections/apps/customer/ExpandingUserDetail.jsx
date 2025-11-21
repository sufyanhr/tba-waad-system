import { useState } from 'react';
import { Box, Typography } from '@mui/material';

const ExpandingUserDetail = ({ data }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body1">User Details for {data?.name || 'N/A'}</Typography>
    </Box>
  );
};

export default ExpandingUserDetail;
