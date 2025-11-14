// src/pages/auth/jwt/RegisterForm.jsx
import { useState } from 'react';
import useAuth from 'hooks/useAuth';
import { TextField, Button, Stack } from '@mui/material';

export default function RegisterForm() {
    const { register } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: ''
    });

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            alert('Account created successfully!');
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <Stack spacing={2}>
                <TextField
                    label="Full Name"
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    fullWidth
                />
                <TextField
                    label="Email"
                    value={form.email}
                    onChange={handleChange('email')}
                    fullWidth
                />
                <TextField
                    label="Phone"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    fullWidth
                />
                <Button type="submit" variant="contained">
                    Sign up
                </Button>
            </Stack>
        </form>
    );
}
