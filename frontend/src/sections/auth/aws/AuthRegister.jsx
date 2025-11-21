import { Typography, Box, Paper, TextField, Button, Stack } from '@mui/material';

const AuthRegister = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>AuthRegister - aws</Typography>
      <Stack spacing={2} sx={{ mt: 3 }}>
        <TextField label="Email" fullWidth />
        <TextField label="Password" type="password" fullWidth />
        <Button variant="contained" fullWidth>Submit</Button>
      </Stack>
    </Paper>
  );
};

export default AuthRegister;
