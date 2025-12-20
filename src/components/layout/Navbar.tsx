import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  InputBase,
  alpha,
  Stack,
  Avatar,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GlobalSearch } from '../common/GlobalSearch';
import { ROUTES } from '../../utils/constants';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate(ROUTES.MY_PROFILE);
    handleMenuClose();
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 'none',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.72),
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { md: `calc(100% - 280px)` }, // Match Sidebar width
          ml: { md: `280px` },
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          <IconButton
            onClick={onMenuClick}
            sx={{ mr: 1, color: 'text.primary', display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 1,
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.12),
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.18),
              },
              mr: 2,
              marginLeft: 0,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Box
              sx={{
                padding: '0 12px',
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </Box>
            <InputBase
              placeholder="Search..."
              onClick={() => setSearchOpen(true)}
              sx={{
                color: 'text.primary',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '10px 10px 10px 48px',
                  // vertical padding + font size from searchIcon
                  transition: (theme) => theme.transitions.create('width'),
                  width: '100%',
                },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right Section */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                src={user?.avatarUrl}
                alt={user?.firstName}
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  ml: 0.75,
                  width: 200,
                  boxShadow: (theme) => theme.customShadows?.dropdown || theme.shadows[20],
                },
              }}
            >
              <Box sx={{ my: 1.5, px: 2.5 }}>
                <Typography variant="subtitle2" noWrap>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {user?.email}
                </Typography>
              </Box>

              <MenuItem onClick={handleProfile} sx={{ typography: 'body2', py: 1, px: 2.5 }}>
                <AccountCircle sx={{ mr: 2, width: 20, height: 20, color: 'text.secondary' }} />
                Profile
              </MenuItem>

              <MenuItem onClick={handleLogout} sx={{ typography: 'body2', py: 1, px: 2.5, color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 2, width: 20, height: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

