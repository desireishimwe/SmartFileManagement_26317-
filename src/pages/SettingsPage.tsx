import React from 'react';
import { Box, Typography } from '@mui/material';

export const SettingsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Settings page coming soon...
      </Typography>
    </Box>
  );
};


