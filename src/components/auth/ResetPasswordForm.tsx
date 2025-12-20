import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../../api/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    try {
      setError(null);
      await authApi.resetPassword({ token, newPassword: data.newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  if (!token) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Invalid reset token. Please request a new password reset.
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        Password reset successfully! Redirecting to login...
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
        label="New Password"
        type="password"
        id="newPassword"
        autoFocus
        {...register('newPassword')}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Confirm New Password"
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
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </Button>
    </Box>
  );
};

