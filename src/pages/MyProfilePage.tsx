import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Avatar,
  Divider,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { User } from '../types/user';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LocationCascadeSelector } from '../components/common/LocationCascadeSelector';

export const MyProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Password change state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordChanging, setPasswordChanging] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const currentUser = await authApi.getCurrentUser();
        // The /auth/me returns UserResponse, we might want to fetch full user details for location
        const fullUser = await userApi.getById(currentUser.id);
        setUser(fullUser);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [field]: e.target.value });
  };

  const handleLocationChange = (locationId: number | null) => {
    if (!user) return;
    // We just need the ID for the update, but the User type has full Location object
    // For simplicity in update, we just set the location ID if it's changed
    // The backend update needs full User object or just fields. 
    // Our userService.updateUser handles details.getLocation()
    if (locationId) {
      setUser({ ...user, location: { id: locationId, name: '', code: '', type: 'PROVINCE' } as any });
    } else {
      setUser({ ...user, location: undefined });
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      // Clean up payload to send only editable fields
      const payload: Partial<User> = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        location: user.location ? { id: user.location.id } as any : null
      };

      await userApi.update(user.id, payload);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordChanging(true);
      setPasswordError(null);
      await userApi.changePassword({
        userId: user?.id,
        oldPassword,
        newPassword
      });
      setSuccess('Password changed successfully!');
      setIsPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordChanging(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center' }}>
        <PersonIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        My Profile
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
      {error && <ErrorMessage message={error} />}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 4, boxShadow: 3, borderRadius: 3, height: '100%' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.light',
                fontSize: 48,
                fontWeight: 700,
                boxShadow: 2
              }}
            >
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              @{user.username}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Role: <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>{user.role}</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </Typography>

            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              fullWidth
              sx={{ mt: 4, borderRadius: 2, textTransform: 'none' }}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Security Settings
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Personal Information
              </Typography>
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      value={user.firstName}
                      onChange={handleChange('firstName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      value={user.lastName}
                      onChange={handleChange('lastName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Email"
                  value={user.email}
                  onChange={handleChange('email')}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Username"
                  value={user.username}
                  onChange={handleChange('username')}
                  fullWidth
                  variant="outlined"
                />

                <Divider sx={{ my: 1 }} />

                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  Your Location
                </Typography>

                <LocationCascadeSelector
                  onLocationSelect={handleLocationChange}
                  initialLocationId={user.location?.id}
                />

                <Box sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={updating ? null : <SaveIcon />}
                    onClick={handleUpdateProfile}
                    disabled={updating}
                    sx={{ borderRadius: 2, px: 4, py: 1.5, textTransform: 'none', fontSize: '1rem' }}
                  >
                    {updating ? 'Updating...' : 'Save Changes'}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, width: '100%', maxWidth: 450 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
          Change Password
          <IconButton onClick={() => setIsPasswordModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Current Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsPasswordModalOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={passwordChanging || !oldPassword || !newPassword}
          >
            {passwordChanging ? 'Changing...' : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};