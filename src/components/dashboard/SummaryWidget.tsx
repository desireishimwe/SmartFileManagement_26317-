import React from 'react';
import { Card, Typography, Box, alpha } from '@mui/material';

interface SummaryWidgetProps {
    title: string;
    total: number;
    icon: React.ReactNode;
    color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

export const SummaryWidget: React.FC<SummaryWidgetProps> = ({
    title,
    total,
    icon,
    color = 'primary'
}) => {
    // const theme = useTheme();

    return (
        <Card
            sx={{
                py: 5,
                boxShadow: 0,
                textAlign: 'center',
                color: (theme) => theme.palette[color].darker,
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.12), // Use alpha for transparency
                borderRadius: 2,
                // Optional: Gradient effect
                backgroundImage: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
            }}
        >
            <Box
                sx={{
                    margin: 'auto',
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    width: 64, // theme.spacing(8)
                    height: 64,
                    justifyContent: 'center',
                    marginBottom: 3,
                    color: (theme) => theme.palette[color].dark,
                    backgroundImage: (theme) =>
                        `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
                }}
            >
                {icon}
            </Box>

            <Typography variant="h3">{total.toLocaleString()}</Typography>

            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                {title}
            </Typography>
        </Card>
    );
};
