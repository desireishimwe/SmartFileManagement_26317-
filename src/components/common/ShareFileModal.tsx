import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    TextField,
    IconButton,
    Stack,
    CircularProgress,
    Alert,
    Tooltip,
    useTheme,
    alpha,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Close as CloseIcon,
    ContentCopy as CopyIcon,
    Check as CheckIcon,
    Link as LinkIcon,
    Share as ShareIcon,
} from '@mui/icons-material';
import { File } from '../../types/file';
import { fileShareApi } from '../../api/fileShareApi';

interface ShareFileModalProps {
    open: boolean;
    onClose: () => void;
    file: File | null;
}

export const ShareFileModal: React.FC<ShareFileModalProps> = ({
    open,
    onClose,
    file,
}) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [expirationDays, setExpirationDays] = useState<number>(30);

    const handleGenerateLink = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const share = await fileShareApi.createShare(file.id, expirationDays);
            const link = fileShareApi.buildShareableLink(share.shareToken);
            setShareLink(link);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate share link');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = async () => {
        if (!shareLink) return;

        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            setError('Failed to copy link to clipboard');
        }
    };

    const handleClose = () => {
        setShareLink(null);
        setError(null);
        setCopied(false);
        setExpirationDays(30);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <ShareIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Share File
                    </Typography>
                </Stack>
                <IconButton size="small" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                    {/* File Info */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            File to share
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {file?.fileName || 'No file selected'}
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {!shareLink ? (
                        <>
                            {/* Expiration Setting */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Link Expiration</InputLabel>
                                <Select
                                    value={expirationDays}
                                    onChange={(e) => setExpirationDays(Number(e.target.value))}
                                    label="Link Expiration"
                                >
                                    <MenuItem value={1}>1 day</MenuItem>
                                    <MenuItem value={7}>7 days</MenuItem>
                                    <MenuItem value={30}>30 days</MenuItem>
                                    <MenuItem value={90}>90 days</MenuItem>
                                    <MenuItem value={0}>Never expires</MenuItem>
                                </Select>
                            </FormControl>

                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Generate a shareable link that anyone can use to download this file.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={handleGenerateLink}
                                    disabled={loading || !file}
                                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LinkIcon />}
                                    sx={{ borderRadius: 2, px: 4 }}
                                >
                                    {loading ? 'Generating...' : 'Generate Link'}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            {/* Generated Link */}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Shareable Link
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        value={shareLink}
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            readOnly: true,
                                            sx: { fontFamily: 'monospace', fontSize: '0.875rem' },
                                        }}
                                    />
                                    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                                        <IconButton
                                            onClick={handleCopyLink}
                                            color={copied ? 'success' : 'primary'}
                                            sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                                            }}
                                        >
                                            {copied ? <CheckIcon /> : <CopyIcon />}
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>

                            <Alert severity="success" icon={<CheckIcon />}>
                                Link generated successfully! Anyone with this link can download the file.
                                {expirationDays > 0 && ` Expires in ${expirationDays} days.`}
                            </Alert>

                            <Button
                                variant="outlined"
                                onClick={() => setShareLink(null)}
                                sx={{ borderRadius: 2 }}
                            >
                                Generate New Link
                            </Button>
                        </>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} color="inherit" sx={{ borderRadius: 2 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareFileModal;
