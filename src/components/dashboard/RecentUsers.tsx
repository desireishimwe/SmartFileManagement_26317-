import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { DataTable, Column } from '../common/DataTable';
import { User } from '../../types/user';
import { formatDate } from '../../utils/formatDate';

interface RecentUsersProps {
  users: User[];
}

export const RecentUsers: React.FC<RecentUsersProps> = ({ users }) => {
  const columns: Column<User>[] = [
    {
      id: 'username',
      label: 'Username',
      render: (user) => (
        <Link href={`/users/${user.id}`} underline="hover">
          {user.username}
        </Link>
      ),
    },
    {
      id: 'firstName',
      label: 'First Name',
    },
    {
      id: 'lastName',
      label: 'Last Name',
    },
    {
      id: 'email',
      label: 'Email',
    },
    {
      id: 'createdAt',
      label: 'Joined',
      render: (user) => formatDate(user.createdAt),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Users
      </Typography>
      <DataTable columns={columns} data={users.slice(0, 10)} emptyMessage="No recent users" />
    </Box>
  );
};

