import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  Stack,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { FolderTreeSelector } from './FolderTreeSelector';
import { Folder } from '../../types/folder';

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, fileName: string, description: string, folderId: number | null) => Promise<void>;
  uploading?: boolean;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  open,
  onClose,
  onUpload,
  uploading = false,
}) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<{ fileName?: string; description?: string; file?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
      setErrors(prev => ({ ...prev, file: undefined }));
    }
  }, [fileName]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
      setErrors(prev => ({ ...prev, file: undefined }));
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFolderSelect = (folderId: number | null, path: Folder[]) => {
    setSelectedFolderId(folderId);
    setFolderPath(path);
  };

  const validateForm = (): boolean => {
    const newErrors: { fileName?: string; description?: string; file?: string } = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a file';
    }
    if (!fileName.trim()) {
      newErrors.fileName = 'File name is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm() || !selectedFile) return;

    try {
      await onUpload(selectedFile, fileName.trim(), description.trim(), selectedFolderId);
      handleClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    if (uploading) return; // Prevent closing while uploading

    setSelectedFile(null);
    setFileName('');
    setDescription('');
    setSelectedFolderId(null);
    setFolderPath([]);
    setErrors({});
    setIsDragging(false);
    onClose();
  };

  const getSelectedFolderDisplay = () => {
    if (selectedFolderId === null || folderPath.length === 0) {
      return 'Root (No folder selected)';
    }
    return folderPath.map(f => f.folderName).join(' / ');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Upload New File
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload documents, images, or other files to your secure storage.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {/* File Drop Zone */}
          <Box>
            <Box
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
              sx={{
                border: '2px dashed',
                borderColor: isDragging ? theme.palette.primary.main : errors.file ? theme.palette.error.main : theme.palette.divider,
                borderRadius: 3,
                p: selectedFile ? 2 : 5,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? alpha(theme.palette.primary.main, 0.05) : theme.palette.background.paper,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                disabled={uploading}
              />

              {!selectedFile ? (
                <>
                  <CloudUploadIcon
                    sx={{
                      fontSize: 48,
                      color: isDragging ? 'primary.main' : 'text.secondary',
                      mb: 2,
                    }}
                  />
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Drag and drop file here
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or click to browse
                  </Typography>
                </>
              ) : (
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="center" py={1}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.main'
                    }}
                  >
                    <FileIcon />
                  </Box>
                  <Box textAlign="left">
                    <Typography variant="subtitle2" fontWeight="bold">
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Box>
                  <Button size="small" color="primary" sx={{ ml: 'auto !important' }} onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}>
                    Change
                  </Button>
                </Stack>
              )}
            </Box>
            {errors.file && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', px: 1 }}>
                {errors.file}
              </Typography>
            )}
          </Box>

          {/* Folder Selection */}
          <Accordion defaultExpanded={false} sx={{ borderRadius: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <FolderIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Select Destination Folder
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getSelectedFolderDisplay()}
                  </Typography>
                </Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <FolderTreeSelector
                selectedFolderId={selectedFolderId}
                onSelect={handleFolderSelect}
              />
            </AccordionDetails>
          </Accordion>

          {/* File Name Input */}
          <TextField
            label="File Name"
            placeholder="Enter file name"
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              setErrors(prev => ({ ...prev, fileName: undefined }));
            }}
            fullWidth
            required
            error={!!errors.fileName}
            helperText={errors.fileName}
            disabled={uploading}
            InputLabelProps={{ shrink: true }}
          />

          {/* Description Textarea */}
          <TextField
            label="Description"
            placeholder="Enter file description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors(prev => ({ ...prev, description: undefined }));
            }}
            fullWidth
            required
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description}
            disabled={uploading}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={uploading} color="inherit" sx={{ borderRadius: 2, px: 3 }}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={uploading || !selectedFile || !fileName.trim() || !description.trim()}
          startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
