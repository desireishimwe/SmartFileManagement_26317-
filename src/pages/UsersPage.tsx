import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Stack,
  Button,
  TextField,
  InputAdornment,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon, Security as SecurityIcon, Search as SearchIcon } from '@mui/icons-material';

import { userApi } from '../api/userApi';
import { locationApi } from '../api/locationApi';
import { User, UserRole } from '../types/user';
import { Location } from '../types/location';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<number | ''>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Load all locations for the dropdown
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoadingLocations(true);
        const data = await locationApi.getAll(0, 1000);
        setLocations(data.content);
      } catch (err) {
        console.error('Failed to load locations:', err);
      } finally {
        setLoadingLocations(false);
      }
    };
    loadLocations();
  }, []);

  const load = async (currentPage = page, size = rowsPerPage, query = searchQuery, locationId?: number) => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, size, keyword: query, sort: 'createdAt,desc' };
      if (locationId) {
        params.locationId = locationId;
      }
      const data = await userApi.getAll(params);
      setUsers(data.content);
      setTotalElements(data.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      load(0, rowsPerPage, searchQuery, selectedLocationId ? Number(selectedLocationId) : undefined);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedLocationId]);

  useEffect(() => {
    load(page, rowsPerPage, searchQuery, selectedLocationId ? Number(selectedLocationId) : undefined);
  }, [page, rowsPerPage]);

  const promote = async (u: User) => {
    try {
      await userApi.update(u.id, { role: UserRole.ADMIN });
      await load(page, rowsPerPage, searchQuery, selectedLocationId ? Number(selectedLocationId) : undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to promote user');
    }
  };

  const demote = async (u: User) => {
    try {
      await userApi.update(u.id, { role: UserRole.STUDENT });
      await load(page, rowsPerPage, searchQuery, selectedLocationId ? Number(selectedLocationId) : undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userApi.delete(id);
      await load(page, rowsPerPage, searchQuery, selectedLocationId ? Number(selectedLocationId) : undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <LoadingSpinner message="Loading users..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box sx={{ pl: 0, ml: 0, marginLeft: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Users
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 200, backgroundColor: 'white' }}>
            <InputLabel>Filter by Location</InputLabel>
            <Select
              value={selectedLocationId}
              label="Filter by Location"
              onChange={(e) => {
                setSelectedLocationId(e.target.value as number | '');
                setPage(0);
              }}
              disabled={loadingLocations}
            >
              <MenuItem value="">
                <em>All Locations</em>
              </MenuItem>
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name} ({location.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300, backgroundColor: 'white' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#666', py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#666', py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#666', py: 2 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#666', py: 2 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {u.firstName} {u.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>{u.email}</TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip label={u.role || 'USER'} size="small" />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {u.role !== UserRole.ADMIN ? (
                            <Button size="small" startIcon={<SecurityIcon />} onClick={() => promote(u)}>
                              Make Admin
                            </Button>
                          ) : (
                            <Button size="small" onClick={() => demote(u)}>
                              Make User
                            </Button>
                          )}
                          <IconButton size="small" onClick={() => remove(u.id)} title="Delete">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};