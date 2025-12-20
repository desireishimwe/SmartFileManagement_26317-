import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Stack,
    Alert,
    Box,
    CircularProgress
} from '@mui/material';
import { MailOutline as MailIcon } from '@mui/icons-material';
import { otpApi } from '../../api/otpApi';

interface OtpVerificationModalProps {
    open: boolean;
    email: string;
    onVerify: () => void;
    onClose: () => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
    open,
    email,
    onVerify,
    onClose
}) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleVerify = async () => {
        if (code.length !== 6) {
            setError('Please enter the 6-digit code');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const isValid = await otpApi.verify(email, code);
            if (isValid) {
                onVerify();
            } else {
                setError('Invalid or expired code');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            setError(null);
            await otpApi.request(email);
            setTimer(60); // 1 minute cooldown
        } catch (err: any) {
            setError('Failed to resend code');
        } finally {
            setResending(false);
        }
    };

    return (
        <Dialog open={open} PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: 400 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
                Verify Your Email
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} alignItems="center" sx={{ mt: 1 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            bgcolor: 'primary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <MailIcon color="primary" sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        We've sent a 6-digit verification code to<br />
                        <strong>{email}</strong>
                    </Typography>

                    {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

                    <TextField
                        autoFocus
                        label="Verification Code"
                        variant="outlined"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputProps={{ style: { textAlign: 'center', letterSpacing: 8, fontSize: 24, fontWeight: 700 } }}
                        fullWidth
                        placeholder="000000"
                        disabled={loading}
                    />

                    <Button
                        onClick={handleResend}
                        disabled={resending || timer > 0}
                        size="small"
                        sx={{ textTransform: 'none' }}
                    >
                        {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>Cancel</Button>
                <Button
                    onClick={handleVerify}
                    variant="contained"
                    disabled={loading || code.length !== 6}
                    sx={{ px: 4 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
