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
import { LocationCascadeSelector } from '../common/LocationCascadeSelector';
import { TwoFactorAuth } from './TwoFactorAuth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .refine((val) => {
      const trimmed = (val || '').trim();
      return trimmed.length > 0 && emailRegex.test(trimmed);
    }, {
      message: 'Please enter a valid email address',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const { verify2FA, signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      const { confirmPassword, ...signupData } = data;
      const response = await signup({ ...signupData, locationId: locationId ?? undefined });

      if (response?.requires2FA) {
        setRequires2FA(true);
        setRegisteredEmail(data.email);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleLocationSelect = (selectedLocationId: number | null) => {
    setLocationId(selectedLocationId);
  };

  if (requires2FA && registeredEmail) {
    return (
      <TwoFactorAuth
        onVerify={async (code: string) => {
          try {
            await verify2FA(registeredEmail, code);
            navigate(ROUTES.DASHBOARD);
          } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed.');
          }
        }}
        onCancel={() => {
          setRequires2FA(false);
          setRegisteredEmail(null);
        }}
      />
    );
  }

  if (success) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        Account created successfully! Redirecting to login...
      </Alert>
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
        id="username"
        label="Username"
        autoComplete="username"
        autoFocus
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        type="email"
        autoComplete="email"
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
        id="firstName"
        label="First Name"
        autoComplete="given-name"
        {...register('firstName')}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="lastName"
        label="Last Name"
        autoComplete="family-name"
        {...register('lastName')}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />

      {/* Location Selector */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Location (Optional)
        </Typography>
        <LocationCascadeSelector
          onLocationSelect={handleLocationSelect}
          initialLocationId={locationId}
        />
      </Box>

      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating account...' : 'Sign Up'}
      </Button>
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} to={ROUTES.LOGIN}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
