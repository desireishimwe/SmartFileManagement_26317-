import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Stack,
    useTheme,
    alpha,
    Chip,
} from '@mui/material';
import {
    Download as DownloadIcon,
    InsertDriveFile as FileIcon,
    ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { fileShareApi, PublicFileInfo } from '../api/fileShareApi';
import { formatFileSize } from '../utils/formatFileSize';

export const PublicDownloadPage: React.FC = () => {
    const theme = useTheme();
    const { token } = useParams<{ token: string }>();
    const [fileInfo, setFileInfo] = useState<PublicFileInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const loadFileInfo = async () => {
            if (!token) {
                setError('Invalid share link');
                setLoading(false);
                return;
            }

            try {
                const info = await fileShareApi.getPublicInfo(token);
                setFileInfo(info);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setError('This share link does not exist or has been removed.');
                } else if (err.response?.status === 410) {
                    setError('This share link has expired.');
                } else {
                    setError('Failed to load file information.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadFileInfo();
    }, [token]);

    const handleDownload = async () => {
        if (!token) return;

        setDownloading(true);
        try {
            const downloadUrl = fileShareApi.getPublicDownloadUrl(token);
            window.open(downloadUrl, '_blank');
        } catch (err) {
            setError('Download failed. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f7fa',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f7fa',
                    p: 3,
                }}
            >
                <Card sx={{ maxWidth: 500, width: '100%', textAlign: 'center', borderRadius: 3, p: 2 }}>
                    <CardContent>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            <ErrorIcon sx={{ fontSize: 40, color: 'error.main' }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Link Not Available
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {error}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f7fa',
                p: 3,
            }}
        >
            <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
                {/* Header */}
                <Box
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        p: 4,
                        textAlign: 'center',
                        color: 'white',
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" sx={{ opacity: 0.9 }}>
                        Smart File Management
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Shared File Download
                    </Typography>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3} alignItems="center">
                        {/* File Icon */}
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <FileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        </Box>

                        {/* File Name */}
                        <Typography variant="h6" fontWeight="bold" textAlign="center">
                            {fileInfo?.fileName}
                        </Typography>

                        {/* File Details */}
                        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                            <Chip
                                label={fileInfo?.fileType || 'Unknown type'}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={formatFileSize(fileInfo?.fileSize || 0)}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`${fileInfo?.downloadCount || 0} downloads`}
                                size="small"
                                variant="outlined"
                            />
                        </Stack>

                        {/* Expiration Info */}
                        {fileInfo?.expiresAt && (
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                This link expires on{' '}
                                {new Date(fileInfo.expiresAt).toLocaleDateString()}
                            </Typography>
                        )}

                        {/* Download Button */}
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleDownload}
                            disabled={downloading}
                            startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                            sx={{
                                borderRadius: 2,
                                px: 6,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                            }}
                        >
                            {downloading ? 'Preparing...' : 'Download File'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PublicDownloadPage;
