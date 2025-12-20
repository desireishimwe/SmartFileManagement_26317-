import React from 'react';
import { Box, Pagination as MuiPagination, Select, MenuItem, FormControl, InputLabel, Typography, SelectChangeEvent } from '@mui/material';
import { PageResponse } from '../../types/api';

interface PaginationProps<T> {
  data: PageResponse<T>;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
  pageSizes?: number[];
}

export function Pagination<T>({ data, onPageChange, onSizeChange, pageSizes = [5, 10, 20, 50, 100] }: PaginationProps<T>) {
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value - 1); // MUI Pagination is 1-indexed, backend is 0-indexed
  };

  const handleSizeChange = (event: SelectChangeEvent<number>) => {
    onSizeChange?.(event.target.value as number);
  };

  // Ensure safe defaults for pagination data
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.number ?? 0;
  const pageSize = data?.size ?? 10;
  const totalElements = data?.totalElements ?? 0;

  // Calculate safe page number (ensure it's a valid number)
  const safePage = Number.isNaN(currentPage) || currentPage < 0 ? 0 : currentPage;
  const muiPage = Math.min(safePage + 1, totalPages); // Convert 0-indexed to 1-indexed, ensure it doesn't exceed totalPages

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
      <Box display="flex" alignItems="center" gap={2}>
        {onSizeChange && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Page Size</InputLabel>
            <Select value={pageSize} onChange={handleSizeChange} label="Page Size">
              {pageSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Typography variant="body2" color="text.secondary">
          Showing {safePage * pageSize + 1} to {Math.min((safePage + 1) * pageSize, totalElements)} of{' '}
          {totalElements} results
        </Typography>
      </Box>
      <MuiPagination
        count={totalPages}
        page={muiPage}
        onChange={handlePageChange}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}

