import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress,
    useTheme,
    IconButton,
    Stack,
    alpha,
} from '@mui/material';
import {
    Close as CloseIcon,
    Download as DownloadIcon,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { File } from '../../types/file';
import { fileApi } from '../../api/fileApi';

interface FilePreviewModalProps {
    open: boolean;
    onClose: () => void;
    file: File | null;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
    open,
    onClose,
    file,
}) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [textContent, setTextContent] = useState<string | null>(null);
    const [imageZoom, setImageZoom] = useState(100);
    const [error, setError] = useState<string | null>(null);

    const isImage = file?.fileType?.startsWith('image/');
    const isPdf = file?.fileType?.includes('pdf');
    const isText = file?.fileType?.startsWith('text/') ||
        file?.fileName?.endsWith('.txt') ||
        file?.fileName?.endsWith('.json') ||
        file?.fileName?.endsWith('.xml') ||
        file?.fileName?.endsWith('.md') ||
        file?.fileName?.endsWith('.csv');

    useEffect(() => {
        if (open && file && isText) {
            loadTextContent();
        }
        return () => {
            setTextContent(null);
            setError(null);
            setImageZoom(100);
        };
    }, [open, file?.id]);

    const loadTextContent = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const response = await fetch(fileApi.getPreviewUrl(file.id), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const text = await response.text();
                setTextContent(text);
            } else {
                setError('Failed to load text content');
            }
        } catch (err) {
            setError('Failed to load text content');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!file) return;
        try {
            await fileApi.download(file.id);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const handleZoomIn = () => {
        setImageZoom((prev) => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setImageZoom((prev) => Math.max(prev - 25, 25));
    };

    const getPreviewContent = () => {
        if (!file) return null;

        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
                    <Typography color="error">{error}</Typography>
                    <Button variant="outlined" onClick={handleDownload} startIcon={<DownloadIcon />}>
                        Download Instead
                    </Button>
                </Box>
            );
        }

        if (isPdf) {
            return (
                <Box
                    component="iframe"
                    src={`${fileApi.getPreviewUrl(file.id)}#toolbar=1&navpanes=0`}
                    sx={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: 2,
                    }}
                    title={file.fileName}
                />
            );
        }

        if (isImage) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        overflow: 'auto',
                        p: 2,
                    }}
                >
                    <Box
                        component="img"
                        src={fileApi.getPreviewUrl(file.id)}
                        alt={file.fileName}
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transform: `scale(${imageZoom / 100})`,
                            transition: 'transform 0.2s ease',
                        }}
                    />
                </Box>
            );
        }

        if (isText && textContent !== null) {
            return (
                <Box
                    sx={{
                        height: '100%',
                        overflow: 'auto',
                        p: 2,
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        component="pre"
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            m: 0,
                        }}
                    >
                        {textContent}
                    </Typography>
                </Box>
            );
        }

        // Unsupported file type
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: 3,
                }}
            >
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <FileIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                    {file.fileName}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    Preview not available for this file type.<br />
                    Click download to view the file.
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleDownload}
                    startIcon={<DownloadIcon />}
                    sx={{ borderRadius: 2 }}
                >
                    Download File
                </Button>
            </Box>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '80vh',
                    maxHeight: '90vh',
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        {file?.fileName || 'File Preview'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {file?.fileType || 'Unknown type'}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                    {isImage && (
                        <>
                            <IconButton size="small" onClick={handleZoomOut} disabled={imageZoom <= 25}>
                                <ZoomOutIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="caption" sx={{ minWidth: 40, textAlign: 'center' }}>
                                {imageZoom}%
                            </Typography>
                            <IconButton size="small" onClick={handleZoomIn} disabled={imageZoom >= 200}>
                                <ZoomInIcon fontSize="small" />
                            </IconButton>
                        </>
                    )}
                    <IconButton size="small" onClick={handleDownload} title="Download">
                        <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent
                sx={{
                    p: 2,
                    height: 'calc(80vh - 120px)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {getPreviewContent()}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit" sx={{ borderRadius: 2 }}>
                    Close
                </Button>
                <Button
                    onClick={handleDownload}
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    sx={{ borderRadius: 2 }}
                >
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FilePreviewModal;
