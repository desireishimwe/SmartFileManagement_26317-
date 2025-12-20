import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  TablePagination,
} from '@mui/material';

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import { locationApi } from '../api/locationApi';
import { Location, LocationType } from '../types/location';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);


  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<LocationType>(LocationType.PROVINCE);
  const [parentId, setParentId] = useState<string>('');
  const [allLocations, setAllLocations] = useState<Location[]>([]);

  const load = async (currentPage = page, size = rowsPerPage, query = searchQuery) => {
    try {
      setLoading(true);
      const data = await locationApi.getAll(currentPage, size, ['id,asc'], query);
      setLocations(data.content);
      setTotalElements(data.totalElements);
      // Also update allLocations for the parent dropdown - maybe fetch all unpaged?
      // For now we use the current page's locations to avoid too many requests
      if (!allLocations.length) {
        const all = await locationApi.getAll(0, 1000);
        setAllLocations(all.content);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      load(0, rowsPerPage, searchQuery);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    load(page, rowsPerPage, searchQuery);
  }, [page, rowsPerPage]);

  const handleOpen = (loc?: Location) => {
    if (loc) {
      setEditingId(loc.id);
      setName(loc.name);
      setCode(loc.code);
      setType(loc.type);
      setParentId(loc.parent?.id?.toString() || '');
    } else {
      setEditingId(null);
      setName('');
      setCode('');
      setType(LocationType.PROVINCE);
      setParentId('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Location> = {
        name,
        code,
        type,
        parent: parentId ? { id: parseInt(parentId), name: '', code: '', type: 'PROVINCE' } as any : null,
      };

      if (editingId) {
        await locationApi.update(editingId, payload);
      } else {
        await locationApi.create(payload);
      }
      handleClose();
      await load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save location');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this location?')) return;
    try {
      await locationApi.delete(id);
      await load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete location');
    }
  };

  if (loading && locations.length === 0) return <LoadingSpinner message="Loading locations..." />;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Locations
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 250, backgroundColor: 'white' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
            Add Location
          </Button>
        </Stack>
      </Stack>

      {error && <ErrorMessage message={error} />}

      <Card sx={{ boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Parent</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    No locations found
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell>{loc.name}</TableCell>
                    <TableCell>{loc.code}</TableCell>
                    <TableCell>{loc.type}</TableCell>
                    <TableCell>{loc.parent?.name || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen(loc)} color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(loc.id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
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
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Location' : 'Add New Location'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Location Name"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Code"
                fullWidth
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value as LocationType)}
                >
                  {Object.values(LocationType).map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Parent Location</InputLabel>
                <Select
                  value={parentId}
                  label="Parent Location"
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {allLocations
                    .filter(l => l.id !== editingId)
                    .map((l) => (
                      <MenuItem key={l.id} value={l.id.toString()}>
                        {l.name} ({l.type})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
