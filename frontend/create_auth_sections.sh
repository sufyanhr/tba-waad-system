#!/bin/bash

# Create all auth provider sections
for provider in jwt firebase auth0 aws supabase; do
  mkdir -p src/sections/auth/${provider}
  
  for page in AuthLogin AuthRegister AuthForgotPassword AuthResetPassword AuthCodeVerification AuthCheckMail; do
    cat > src/sections/auth/${provider}/${page}.jsx << EOF
import { Typography, Box, Paper, TextField, Button, Stack } from '@mui/material';

const ${page} = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>${page} - ${provider}</Typography>
      <Stack spacing={2} sx={{ mt: 3 }}>
        <TextField label="Email" fullWidth />
        <TextField label="Password" type="password" fullWidth />
        <Button variant="contained" fullWidth>Submit</Button>
      </Stack>
    </Paper>
  );
};

export default ${page};
EOF
  done
done

echo "All auth sections created!"
