import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  People as PeopleIcon,
  Folder as FolderIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { StatsCard } from './StatsCard';
import { RecentFiles } from './RecentFiles';
import { RecentUsers } from './RecentUsers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { dashboardApi } from '../../api/dashboardApi';
import { DashboardStats, AuditLog } from '../../types/api';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!stats) {
    return <ErrorMessage message="No data available" />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Files"
            value={stats.totalFiles}
            icon={<FileIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Folders"
            value={stats.totalFolders}
            icon={<FolderIcon />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Locations"
            value={stats.totalLocations}
            icon={<LocationIcon />}
            color="info.main"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RecentFiles files={stats.recentFiles || []} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentUsers users={stats.recentUsers || []} />
        </Grid>
        {stats.recentActivity && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List dense>
                  {stats.recentActivity.map((log: AuditLog) => (
                    <ListItem key={log.id} divider>
                      <ListItemText
                        primary={log.action}
                        secondary={`${log.userEmail || 'Unknown'} • ${new Date(log.createdAt).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                  {stats.recentActivity.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No recent activity" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

