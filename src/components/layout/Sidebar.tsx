import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Typography,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  InsertDriveFile as FileIcon,
  People as PeopleIcon,
  BarChart as ReportsIcon,
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { isAdmin, getRoleDisplayName } from '../../utils/roleUtils';

export const DRAWER_WIDTH = 280;

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const adminMenu = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
    { text: 'Files', icon: <FileIcon />, path: ROUTES.FILES },
    { text: 'Folders', icon: <ArchiveIcon />, path: ROUTES.FOLDERS },
    { text: 'Users', icon: <PeopleIcon />, path: ROUTES.USERS },
    { text: 'Locations', icon: <LocationOnIcon />, path: ROUTES.LOCATIONS },
    { text: 'Reports', icon: <ReportsIcon />, path: ROUTES.REPORTS },
  ];

  const userMenu = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
    { text: 'Files', icon: <FileIcon />, path: ROUTES.FILES },
    { text: 'Folders', icon: <ArchiveIcon />, path: ROUTES.FOLDERS },
    { text: 'My Profile', icon: <SettingsIcon />, path: ROUTES.MY_PROFILE },
  ];

  const filteredMenuItems = isAdmin(user?.role) ? adminMenu : userMenu;

  const handleNavigation = (path: string) => {
    if (path) {
      navigate(path);
      if (isMobile) onMobileClose();
    }
  };

  const isRouteActive = (path: string): boolean => {
    if (location.pathname === path) return true;
    if (path === ROUTES.FILES && location.pathname.startsWith('/files/') && location.pathname !== '/files') return false;
    return false;
  };

  const renderContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo Section */}
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Smart<Typography component="span" variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>File</Typography>
        </Typography>
      </Box>

      {/* User Account Section */}
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 1.5,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <Avatar src={user?.avatarUrl} alt={user?.firstName} sx={{ width: 40, height: 40 }} />
          <Box sx={{ ml: 2, overflow: 'hidden' }}>
            <Typography variant="subtitle2" noWrap>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {getRoleDisplayName(user?.role as any)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu List */}
      <List disablePadding sx={{ px: 1 }}>
        {filteredMenuItems.map((item) => {
          const isActive = isRouteActive(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  height: 48,
                  borderRadius: 1,
                  position: 'relative',
                  textTransform: 'capitalize',
                  bgcolor: isActive ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 'fontWeightBold' : 'fontWeightMedium',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    typography: 'body2',
                    fontWeight: isActive ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Illustration or Footer space could go here */}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        width: { md: DRAWER_WIDTH },
      }}
    >
      {isMobile ? (
        <Drawer
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              borderRight: '1px dashed rgba(145, 158, 171, 0.24)',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              borderRight: '1px dashed rgba(145, 158, 171, 0.24)',
              bgcolor: 'background.default',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
};

