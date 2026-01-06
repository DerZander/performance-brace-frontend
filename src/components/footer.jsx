import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        p: 2, 
        mt: 'auto', 
        backgroundColor: '#f5f5f5', 
        textAlign: 'center' 
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()}{' '}
        <Link href="https://www.zander.digital" underline="hover" color="inherit">
          zander.digital
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;