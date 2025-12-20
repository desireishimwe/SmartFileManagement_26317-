import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  InsertDriveFile as FileIcon,
  Business as FolderIcon,
  Timeline as ActivityIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { dashboardApi } from '../api/dashboardApi';
import { auditApi } from '../api/auditApi';
import { DashboardStats, AuditLog } from '../types/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { SummaryWidget } from '../components/dashboard/SummaryWidget';
import { formatFileSize } from '../utils/formatFileSize';
import { useAuth } from '../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardApi.getStats();
        setStats(statsData);
        const activityData = await auditApi.recent(10);
        setActivity(activityData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const { user } = useAuth();
  const isAdminUser = user?.role === 'ADMIN' || user?.role === 'STAFF';

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error || !stats) return <ErrorMessage message={error || 'No dashboard data'} />;

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {isAdminUser ? 'Admin Dashboard' : 'Welcome back 👋'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isAdminUser
            ? "Here's a summary of the system's activity."
            : "Here's what's happening with your files today."}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryWidget
            title="Total Files"
            total={stats.totalFiles || 0}
            icon={<FileIcon width={24} />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryWidget
            title="Total Users"
            total={stats.totalUsers || 0}
            icon={<PeopleIcon width={24} />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryWidget
            title="Total Folders"
            total={stats.totalFolders || 0}
            icon={<FolderIcon width={24} />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryWidget
            title="Locations"
            total={stats.totalLocations || 0}
            icon={<LocationIcon width={24} />}
            color="error"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {/* Storage Widget */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', boxShadow: (theme) => theme.customShadows?.card }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Storage Used
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  {formatFileSize(stats.totalSize || 0)} used of 1GB
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {Math.min(100, Math.round(((stats.totalSize || 0) / (1024 * 1024 * 1024)) * 100))}%
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 10, bgcolor: 'background.neutral', borderRadius: 5, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${Math.min(100, ((stats.totalSize || 0) / (1024 * 1024 * 1024)) * 100)}%`,
                    height: '100%',
                    bgcolor: 'primary.main',
                    transition: 'width 1s ease-in-out'
                  }}
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* File Type Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', boxShadow: (theme) => theme.customShadows?.card }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              File Types
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {Object.entries(stats.fileTypeDistribution || {}).slice(0, 4).map(([type, count]) => (
                <Grid item xs={6} key={type}>
                  <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
                    <Typography variant="subtitle2" noWrap title={type}>
                      {type.split('/')[1]?.toUpperCase() || type.toUpperCase()}
                    </Typography>
                    <Typography variant="h5" color="primary.main">
                      {count}
                    </Typography>
                  </Box>
                </Grid>
              ))}
              {Object.keys(stats.fileTypeDistribution || {}).length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">No files uploaded yet.</Typography>
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', boxShadow: (theme) => theme.customShadows?.card }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Recent Users
              </Typography>
              <List disablePadding>
                {(stats.recentUsers || []).slice(0, 5).map((user, index) => (
                  <ListItem key={user.id || index} sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon>
                      <Avatar
                        alt={user.firstName}
                        src={user.avatarUrl} // Assuming avatarUrl exists or fallback
                        sx={{ bgcolor: 'primary.lighter', color: 'primary.dark' }}
                      >
                        {user.firstName?.[0] || '?'}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {user.firstName} {user.lastName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {user.email}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
                {(!stats.recentUsers || stats.recentUsers.length === 0) && (
                  <ListItem>
                    <ListItemText primary="No recent users" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <Card sx={{ height: '100%', boxShadow: (theme) => theme.customShadows?.card }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Recent Activity
              </Typography>
              <List disablePadding>
                {activity.map((a) => (
                  <ListItem key={a.id} sx={{ px: 0, py: 1.5, borderBottom: '1px dashed rgba(145, 158, 171, 0.24)' }}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'background.neutral',
                        }}
                      >
                        <ActivityIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          {a.action}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                          {new Date(a.createdAt).toLocaleString()} • {a.userEmail || 'Unknown'}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
                {activity.length === 0 && (
                  <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
                    No recent activity
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

