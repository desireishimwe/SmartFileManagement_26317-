import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { DataTable, Column } from '../common/DataTable';
import { File } from '../../types/file';
import { formatFileSize } from '../../utils/formatFileSize';
import { formatDate } from '../../utils/formatDate';

interface RecentFilesProps {
  files: File[];
}

export const RecentFiles: React.FC<RecentFilesProps> = ({ files }) => {
  const columns: Column<File>[] = [
    {
      id: 'fileName',
      label: 'File Name',
      render: (file) => (
        <Link href={`/files/${file.id}`} underline="hover">
          {file.fileName}
        </Link>
      ),
    },
    {
      id: 'fileType',
      label: 'Type',
    },
    {
      id: 'fileSize',
      label: 'Size',
      render: (file) => formatFileSize(file.fileSize),
    },
    {
      id: 'uploadedAt',
      label: 'Uploaded',
      render: (file) => formatDate(file.uploadedAt),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Files
      </Typography>
      <DataTable columns={columns} data={files.slice(0, 10)} emptyMessage="No recent files" />
    </Box>
  );
};

