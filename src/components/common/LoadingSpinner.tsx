import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
      <CircularProgress />
      {message && <Typography color="text.secondary">{message}</Typography>}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="background.paper"
        zIndex={9999}
      >
        {content}
      </Box>
    );
  }

  return <Box py={4}>{content}</Box>;
};

