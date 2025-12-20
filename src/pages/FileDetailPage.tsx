import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Grid,
  Divider,
  Paper,
  IconButton,
  TextField
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as FileIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { fileApi } from '../api/fileApi';
import { File } from '../types/file';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { formatFileSize } from '../utils/formatFileSize';
import { formatDate } from '../utils/formatDate';
import { ROUTES } from '../utils/constants';
import { FilePreviewModal } from '../components/common/FilePreviewModal';
import { ShareFileModal } from '../components/common/ShareFileModal';

export const FileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await fileApi.getById(Number(id));
        setFile(data);
        setEditName(data.fileName);
        setEditDescription(data.description || '');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load file');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDownload = async () => {
    if (!file) return;
    try {
      await fileApi.download(file.id);
    } catch (err: any) {
      setError("Download failed");
    }
  };

  const handleDelete = async () => {
    if (!file || !window.confirm("Are you sure you want to permanently delete this file?")) return;
    try {
      await fileApi.delete(file.id);
      navigate(ROUTES.FILES);
    } catch (err: any) {
      setError("Delete failed");
    }
  };

  const handleSave = async () => {
    if (!file) return;
    try {
      setSaving(true);
      const updated = await fileApi.update(file.id, { fileName: editName, description: editDescription });
      setFile(updated);
      setIsEditing(false);
    } catch (err: any) {
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading file details..." />;
  if (error || !file) return <ErrorMessage message={error || 'File not found'} />;

  const isPdf = file.fileType?.includes('pdf');
  const isImage = file.fileType?.startsWith('image/');
  const canPreview = isPdf || isImage;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(ROUTES.FILES)}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Back to Files
      </Button>

      <Grid container spacing={3}>
        {/* Left Column: Preview or Placeholder */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              height: '600px',
              bgcolor: '#f8f9fa',
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              borderRadius: 2
            }}
          >
            {canPreview ? (
              isPdf ? (
                <Box component="iframe" src={fileApi.getPreviewUrl(file.id)} width="100%" height="100%" sx={{ border: 'none' }} />
              ) : (
                <Box
                  component="img"
                  src={fileApi.getPreviewUrl(file.id)}
                  alt={file.fileName}
                  sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              )
            ) : (
              <Stack alignItems="center" spacing={2} color="text.secondary">
                <FileIcon sx={{ fontSize: 64, opacity: 0.5 }} />
                <Typography>No preview available</Typography>
                <Button variant="outlined" onClick={handleDownload} startIcon={<DownloadIcon />}>
                  Download to View
                </Button>
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Right Column: Details & Actions */}
        <Grid item xs={12} md={5}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                      {isEditing ? 'Editing File' : 'File Details'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {!isEditing && (
                      <>
                        <IconButton size="small" onClick={() => setIsEditing(true)} title="Edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={handleDelete} title="Delete">
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Stack>
                </Box>

                {isEditing ? (
                  <Stack spacing={2}>
                    <TextField
                      label="File Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      fullWidth
                      variant="outlined"
                    />
                    <TextField
                      label="Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button onClick={() => setIsEditing(false)} disabled={saving} color="inherit">
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={<SaveIcon />}>
                        Save
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <>
                    <Box>
                      <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                        {file.fileName}
                      </Typography>
                      <Chip label={file.fileType || 'Unknown Type'} size="small" sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 500 }} />
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {file.description || 'No description provided.'}
                      </Typography>
                    </Box>

                    <Divider />

                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <CalendarIcon color="action" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Uploaded</Typography>
                          <Typography variant="body2">{formatDate(file.uploadedAt)}</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <PersonIcon color="action" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Owner</Typography>
                          <Typography variant="body2">{file.user?.email || 'Unknown'}</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <FileIcon color="action" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Size</Typography>
                          <Typography variant="body2">{formatFileSize(file.fileSize || 0)}</Typography>
                        </Box>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<PreviewIcon />}
                        onClick={() => setPreviewOpen(true)}
                        sx={{ height: 48 }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        sx={{ height: 48 }}
                      >
                        Download
                      </Button>
                    </Stack>

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<ShareIcon />}
                      onClick={() => setShareOpen(true)}
                      sx={{ height: 48, mt: 1 }}
                      color="secondary"
                    >
                      Share File
                    </Button>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* File Preview Modal */}
      <FilePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        file={file}
      />

      {/* Share File Modal */}
      <ShareFileModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        file={file}
      />
    </Box>
  );
};