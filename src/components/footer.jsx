import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                p: { xs: 2, sm: 3 },
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : '#1a1a1a',
                borderTop: '1px solid #e0e0e0',
                textAlign: 'center',
                width: '100%',
                flexShrink: 0
            }}
        >
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 0 }
                }}
            >
                © {new Date().getFullYear()}{' '}
                <Link
                    href="https://www.zander.digital"
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="inherit"
                    sx={{ fontWeight: 500 }}
                >
                    zander.digital
                </Link>
                {' '}- Alle Rechte vorbehalten
            </Typography>
        </Box>
    );
};

export default Footer;