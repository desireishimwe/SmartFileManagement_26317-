import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import { dashboardApi } from '../api/dashboardApi';
import { auditApi } from '../api/auditApi';
import { DashboardStats, AuditLog } from '../types/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const ReportsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getStats();
        const logs = await auditApi.recent(50); // Fetch more for the report
        setStats(data);
        setActivity(logs);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleExport = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner message="Loading reports..." />;
  if (error || !stats) return <ErrorMessage message={error || 'No report data'} />;

  return (
    <Box sx={{
      p: { xs: 2, md: 3 },
      "@media print": {
        p: 0,
        m: 0,
        "& .no-print": { display: 'none' }
      }
    }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{ borderBottom: '2px solid #eee', pb: 2 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            System Activity Report
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generated on: {new Date().toLocaleString()}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleExport}
          className="no-print"
          sx={{ borderRadius: 2 }}
        >
          Export PDF
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            System Summary
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Total Files', value: stats.totalFiles },
              { label: 'Total Users', value: stats.totalUsers },
              { label: 'Total Folders', value: stats.totalFolders },
              { label: 'Total Locations', value: stats.totalLocations },
            ].map((item) => (
              <Grid item xs={6} md={3} key={item.label}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: '#fafafa' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
        Recent Activity Logs
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>User Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Resource</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activity.length > 0 ? (
              activity.map((log) => (
                <TableRow key={log.id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{log.action}</TableCell>
                  <TableCell>{log.userEmail || 'System'}</TableCell>
                  <TableCell>{log.resourceType || '-'}</TableCell>
                  <TableCell variant="body">{log.details || '-'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No activity logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, display: 'none', displayPrint: 'block', textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          End of Report - Smart File Management System
        </Typography>
      </Box>
    </Box>
  );
};