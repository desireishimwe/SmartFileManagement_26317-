import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { TwoFactorAuth } from './TwoFactorAuth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .refine((val) => {
      const trimmed = (val || '').trim();
      return trimmed.length > 0 && emailRegex.test(trimmed);
    }, {
      message: 'Please enter a valid email address',
    }),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [loginData, setLoginData] = useState<LoginFormData | null>(null);
  const { login, verify2FA } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      const res = await login(data);
      if (res?.requires2FA) {
        setRequires2FA(true);
        setLoginData(data);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  if (requires2FA && loginData) {
    return (
      <TwoFactorAuth
        onVerify={async (code) => {
          try {
            await verify2FA(loginData.email, code);
            navigate(ROUTES.DASHBOARD);
          } catch (err: any) {
            setError(err.response?.data?.message || '2FA verification failed.');
          }
        }}
        onCancel={() => {
          setRequires2FA(false);
          setLoginData(null);
        }}
      />
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        type="email"
        autoComplete="email"
        autoFocus
        {...register('email', {
          setValueAs: (value) => (value || '').trim(),
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD} variant="body2">
          Forgot password?
        </Link>
      </Box>
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link component={RouterLink} to={ROUTES.SIGNUP}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

