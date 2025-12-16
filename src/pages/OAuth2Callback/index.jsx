import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, CircularProgress, Typography, Alert } from '@mui/material';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      // Token von URL-Parametern holen
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      // Fehler behandeln
      if (errorParam) {
        setError(`Login fehlgeschlagen: ${errorParam}`);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Token speichern und weiterleiten
      if (token) {
        try {
          // Token in localStorage speichern
          localStorage.setItem('authToken', token);
          
          // Optional: User-Daten vom Backend holen
          // const response = await apiClient.get('/user/me');
          // localStorage.setItem('user', JSON.stringify(response.data));
          
          // Zum Dashboard weiterleiten
          navigate('/dashboard');
        } catch (err) {
          setError('Fehler beim Verarbeiten des Logins');
          setTimeout(() => navigate('/login'), 3000);
        }
      } else {
        setError('Kein Token erhalten');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={3}
      >
        {error ? (
          <>
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
            <Typography variant="body2" color="textSecondary">
              Sie werden zum Login weitergeleitet...
            </Typography>
          </>
        ) : (
          <>
            <CircularProgress size={60} />
            <Typography variant="h6">
              Login wird verarbeitet...
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Bitte warten Sie einen Moment
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default OAuth2Callback;
