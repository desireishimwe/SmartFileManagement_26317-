import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
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
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import { fileApi } from '../api/fileApi';
import { File } from '../types/file';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { formatFileSize } from '../utils/formatFileSize';
import { formatDate } from '../utils/formatDate';
import { FileUploadModal } from '../components/common/FileUploadModal';
import { useAuth } from '../hooks/useAuth';
import { TextField, InputAdornment, TablePagination } from '@mui/material';


export const FilesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFiles(0, rowsPerPage, searchQuery);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchFiles(page, rowsPerPage, searchQuery);
  }, [page, rowsPerPage]);

  const fetchFiles = async (currentPage = page, size = rowsPerPage, query = searchQuery) => {
    try {
      setLoading(true);
      const data = await fileApi.getAll({
        keyword: query,
        page: currentPage,
        size,
        sort: 'uploadedAt,desc'
      });
      setFiles(data.content);
      setTotalElements(data.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      await fileApi.download(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download file');
    }
  };

  const handleUpload = async (file: globalThis.File, fileName: string, description: string, folderId: number | null) => {
    if (!user) return;
    try {
      setUploading(true);
      await fileApi.upload(file, user.id, folderId ?? 0, fileName, description || fileName);
      setUploadOpen(false);
      await fetchFiles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      await fileApi.delete(id);
      await fetchFiles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete file');
    }
  };

  const openEdit = (file: File) => {
    setEditFile(file);
    setEditName(file.fileName || '');
    setEditDescription(file.description || '');
  };

  const handleEditSave = async () => {
    if (!editFile) return;
    try {
      await fileApi.update(editFile.id, { fileName: editName, description: editDescription });
      setEditFile(null);
      await fetchFiles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update file');
    }
  };

  if (loading) return <LoadingSpinner message="Loading files..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box sx={{ pl: 0, ml: 0, marginLeft: 0 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5, mt: 0, pl: 0, ml: 0 }}>
            Files
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ pl: 0 }}>
            Your accessible files. Admins see all; users see their own.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search files..."
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
          <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={() => setUploadOpen(true)}>
            Upload File
          </Button>
        </Stack>
      </Box>

      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                Files List
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalElements} file(s) total
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#666', py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#666', py: 2 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#666', py: 2 }}>Size</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#666', py: 2 }}>Uploaded</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#666', py: 2 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No files found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  files.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell sx={{ py: 2 }}>
                        <Button
                          color="inherit"
                          sx={{ textTransform: 'none', justifyContent: 'flex-start', p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                          onClick={() => navigate(`${ROUTES.FILES}/${f.id}`)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FileIcon sx={{ fontSize: 20, color: '#666' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {f.fileName}
                            </Typography>
                          </Box>
                        </Button>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={f.fileType || 'unknown'}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd', fontWeight: 500, fontSize: '11px' }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>{formatFileSize(f.fileSize || 0)}</TableCell>
                      <TableCell sx={{ py: 2 }}>{formatDate(f.uploadedAt)}</TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <IconButton size="small" onClick={() => navigate(`${ROUTES.FILES}/${f.id}`)} title="View Details">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDownload(f.id)} title="Download">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => openEdit(f)} title="Quick Edit">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(f.id)} title="Delete">
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

      <FileUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={(file: globalThis.File, fileName: string, description: string, folderId: number | null) => handleUpload(file, fileName, description, folderId)}
        uploading={uploading}
      />

      <Dialog
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fullWidth
        maxWidth="lg"
        aria-labelledby="file-preview-title"
      >
        <DialogTitle id="file-preview-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{previewFile?.fileName}</Typography>
          <Stack direction="row" spacing={1}>
            {previewFile && (
              <Button size="small" onClick={() => handleDownload(previewFile.id)}>
                Download
              </Button>
            )}
            <Button size="small" onClick={() => setPreviewFile(null)}>
              Close
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ height: '80vh' }}>
          {previewFile ? (
            previewFile.fileType?.includes('pdf') ? (
              <Box component="iframe" src={fileApi.getPreviewUrl(previewFile.id)} width="100%" height="100%" />
            ) : previewFile.fileType?.startsWith('image/') ? (
              <Box
                component="img"
                src={fileApi.getPreviewUrl(previewFile.id)}
                alt={previewFile.fileName}
                sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', mx: 'auto' }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Preview not available. Use Download instead.
              </Typography>
            )
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editFile} onClose={() => setEditFile(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit File</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth />
          <TextField
            label="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={() => setEditFile(null)}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSave} disabled={!editName.trim()}>
              Save
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};