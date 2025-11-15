// src/pages/auth/jwt/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

// mui
import { TextField, Button, Stack } from '@mui/material';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(identifier, password);
      if (result.success) {
        navigate('/dashboard/default');
      } else {
        alert(result.message || 'Invalid login');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Invalid login');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Stack spacing={2}>
        <TextField
          label="Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </form>
  );
}
