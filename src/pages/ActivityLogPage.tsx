import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

interface ActivityLogEntry {
  id: number;
  action: string;
  student: string;
  time: string;
  iconColor: 'success' | 'info' | 'error';
}

export const ActivityLogPage: React.FC = () => {
  const [activities] = useState<ActivityLogEntry[]>([
    {
      id: 1,
      action: 'Admin uploaded Registration Form.pdf',
      student: 'John Doe',
      time: '2 hours ago',
      iconColor: 'success',
    },
    {
      id: 2,
      action: 'Registrar viewed Transcript.pdf',
      student: 'John Doe',
      time: '5 hours ago',
      iconColor: 'info',
    },
    {
      id: 3,
      action: 'File Manager deleted Old Document.pdf',
      student: 'Sarah Smith',
      time: '1 day ago',
      iconColor: 'error',
    },
    {
      id: 4,
      action: 'Finance Office uploaded Fee Payment.pdf',
      student: 'Michael Johnson',
      time: '2 days ago',
      iconColor: 'success',
    },
    {
      id: 5,
      action: 'Registrar viewed Grade Report.pdf',
      student: 'Michael Johnson',
      time: '3 days ago',
      iconColor: 'info',
    },
  ]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In the future, fetch activity logs from API
    // For now, using mock data
  }, []);

  const getIconColor = (color: 'success' | 'info' | 'error'): string => {
    switch (color) {
      case 'success':
        return '#4caf50'; // Green
      case 'info':
        return '#2196f3'; // Blue
      case 'error':
        return '#f44336'; // Red
      default:
        return '#757575'; // Grey
    }
  };

  return (
    <Box sx={{ pl: 0, ml: 0, marginLeft: 0 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5, mt: 0, pl: 0, ml: 0 }}>
          Activity Log
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ pl: 0 }}>
          Monitor all system activities.
        </Typography>
      </Box>

      {/* Activity Log Card */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {/* Card Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', mb: 0.5 }}>
              Activity Log
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All system activities and changes.
            </Typography>
          </Box>

          {/* Activity List */}
          <Box sx={{ p: 2 }}>
            {activities.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No activities found</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activities.map((activity, index) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2,
                      borderBottom: index < activities.length - 1 ? '1px solid #e0e0e0' : 'none',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: getIconColor(activity.iconColor),
                        flexShrink: 0,
                      }}
                    >
                      <TrendingUpIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, fontSize: '14px' }}>
                        {activity.action}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Student: {activity.student}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
