import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <Box sx={{ display: { xs: 'block', print: 'none' } }}>
        <Navbar onMenuClick={handleDrawerToggle} />
      </Box>
      <Box sx={{ display: { xs: 'block', print: 'none' } }}>
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          minHeight: '100%',
          pt: { xs: 8, md: 10, print: 0 },
          pb: { xs: 10, print: 0 },
          pl: { xs: 2, md: 2, print: 0 },
          pr: { xs: 2, md: 2, print: 0 },
          width: '100%'
        }}
      >
        {children}
        <Box sx={{ display: { xs: 'block', print: 'none' } }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

