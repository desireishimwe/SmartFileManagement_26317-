import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Box,
} from '@mui/material';

export interface Column<T> {
  id: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: number }>({
  columns,
  data,
  onSort,
  sortField,
  sortDirection,
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  const handleSort = (field: string) => {
    if (!onSort) return;
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, direction);
  };

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sortDirection={sortField === column.id ? sortDirection : false}
              >
                {column.sortable && onSort ? (
                  <TableSortLabel
                    active={sortField === column.id}
                    direction={sortField === column.id ? sortDirection : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {safeData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Box py={4}>
                  {emptyMessage}
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            safeData.map((row) => (
              <TableRow 
                key={row.id} 
                hover 
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'}>
                    {column.render ? column.render(row) : (row as any)[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

