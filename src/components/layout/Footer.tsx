import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="#">
            Smart File Management System
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Help
          </Link>
          |
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Documentation
          </Link>
          |
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Support
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

