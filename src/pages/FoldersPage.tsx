import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Breadcrumbs,
  Link,
  Divider,
  Grid
} from '@mui/material';
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import { folderApi } from '../api/folderApi';
import { fileApi } from '../api/fileApi';
import { Folder } from '../types/folder';
import { File } from '../types/file';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useNavigate, useParams } from 'react-router-dom';
import { formatFileSize } from '../utils/formatFileSize';
import { formatDate } from '../utils/formatDate';
import { InputAdornment, TablePagination } from '@mui/material';


interface BreadcrumbItem {
  id: number | null;
  name: string;
}

export const FoldersPage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState<Folder | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: null, name: 'Home' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [saving, setSaving] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();


  const loadFolderContents = async (folderId: number | null, currentPage = page, size = rowsPerPage, query = searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      // If we have a search query, we fetch globally-owned folders matching the query
      if (query.trim()) {
        const data = await folderApi.getAll({ page: currentPage, size, keyword: query });
        setFolders(data.content);
        setTotalElements(data.totalElements);
        setFiles([]); // Hide files or handle differently in search
        return;
      }

      const folderPromise = folderId
        ? folderApi.getSubFolders(folderId)
        : folderApi.getRootFolders();

      const filesPromise = folderId
        ? fileApi.getByFolder(folderId)
        : Promise.resolve([]);

      const [foldersData, filesData] = await Promise.all([folderPromise, filesPromise]);

      setFolders(foldersData);
      setFiles(filesData);
      setTotalElements(foldersData.length);

      if (!folderId) {
        setBreadcrumbs([{ id: null, name: 'Home' }]);
        setCurrentFolder(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        loadFolderContents(parseInt(id || '0') || null, 0, rowsPerPage, searchQuery);
        setPage(0);
      } else {
        loadFolderContents(parseInt(id || '0') || null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (id) {
      const folderId = parseInt(id);
      loadFolderContents(folderId, page, rowsPerPage, searchQuery);
      // Fetch current folder metadata if we're jumping directly to it
      folderApi.getById(folderId).then(folder => {
        setCurrentFolder(folder);
        setBreadcrumbs([{ id: null, name: 'Home' }, { id: folder.id, name: folder.folderName }]);
      }).catch(() => {
        // Fallback or ignore
      });
    } else {
      loadFolderContents(null, page, rowsPerPage, searchQuery);
    }
  }, [id, page, rowsPerPage]);

  const handleFolderClick = (folder: Folder) => {
    navigate(`/folders/${folder.id}`);
  };

  const handleBreadcrumbClick = (folderId: number | null) => {
    if (folderId === null) {
      navigate('/folders');
    } else {
      navigate(`/folders/${folderId}`);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      setSaving(true);
      if (editing) {
        await folderApi.update(editing.id, { folderName: name, description });
      } else {
        await folderApi.create({
          folderName: name,
          description,
          parentFolderId: currentFolder?.id
        });
      }
      setName('');
      setDescription('');
      setEditing(null);
      await loadFolderContents(currentFolder?.id || null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save folder');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (folder: Folder) => {
    setEditing(folder);
    setName(folder.folderName || '');
    setDescription(folder.description || '');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      try {
        await folderApi.delete(id);
        await loadFolderContents(currentFolder?.id || null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete folder');
      }
    }
  };

  if (loading && folders.length === 0) return <LoadingSpinner message="Loading..." />;

  return (
    <Box sx={{ p: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Folders
        </Typography>
        <TextField
          size="small"
          placeholder="Search folders..."
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

      {/* Breadcrumbs */}
      <Card sx={{ mb: 3, boxShadow: 1, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            {breadcrumbs.map((b, index) => (
              <Link
                key={index}
                underline="hover"
                color={index === breadcrumbs.length - 1 ? "text.primary" : "inherit"}
                onClick={() => handleBreadcrumbClick(b.id)}
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {b.id === null && <FolderIcon sx={{ mr: 0.5 }} fontSize="inherit" />}
                {b.name}
              </Link>
            ))}
          </Breadcrumbs>
        </CardContent>
      </Card>

      {/* Create/Edit Folder Form - Fixed layout */}
      <Card sx={{ mb: 4, boxShadow: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            {editing ? 'Edit Folder' : `Create New Subfolder ${currentFolder ? `in ${currentFolder.folderName}` : 'in Home'}`}
          </Typography>

          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} sm={5}>
              <TextField
                label="Folder Name"
                placeholder="Enter folder name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Description (Optional)"
                placeholder="What is this folder for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                startIcon={editing ? <EditIcon /> : <AddIcon />}
                onClick={handleSave}
                disabled={saving}
                fullWidth
                sx={{ height: 56, borderRadius: 1.5, textTransform: 'none', fontSize: '1rem' }}
              >
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </Button>
            </Grid>
          </Grid>

          {editing && (
            <Button
              size="small"
              color="inherit"
              onClick={() => {
                setEditing(null);
                setName('');
                setDescription('');
              }}
              sx={{ mt: 1 }}
            >
              Cancel Edit
            </Button>
          )}
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} />}

      <Grid container spacing={4}>
        {/* Folders List */}
        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: 2, borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
                Subfolders
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {folders.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary={<Typography color="text.secondary">No subfolders found.</Typography>}
                    />
                  </ListItem>
                ) : (
                  folders.map((f) => (
                    <ListItem
                      key={f.id}
                      divider
                      sx={{
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      secondaryAction={
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(f); }} title="Edit">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }} title="Delete">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      }
                      disablePadding
                    >
                      <ListItemButton onClick={() => handleFolderClick(f)} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                          <FolderIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={f.folderName}
                          secondary={f.description || 'No description'}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
                )}
              </List>
              {searchQuery.trim() && (
                <TablePagination
                  component="div"
                  count={totalElements}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Files List */}
        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: 2, borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                <FileIcon sx={{ mr: 1, color: 'secondary.main' }} />
                Files in Folder
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <List>
                {files.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary={<Typography color="text.secondary">No files in this folder.</Typography>}
                    />
                  </ListItem>
                ) : (
                  files.map((file) => (
                    <ListItem key={file.id} divider>
                      <ListItemIcon>
                        <FileIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.fileName}
                        secondary={`${formatFileSize(file.fileSize)} • ${formatDate(file.uploadedAt)}`}
                        primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper component for list items with click handler correctly bound
const ListItemButton = ({ children, onClick, sx }: { children: React.ReactNode, onClick: () => void, sx?: any }) => (
  <Box
    component="div"
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      cursor: 'pointer',
      ...sx
    }}
  >
    {children}
  </Box>
);