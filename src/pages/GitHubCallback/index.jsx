import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { validateState } from '../../config/oauth';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGitHub } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');
    
      // Fehler von GitHub
      if (errorParam) {
        setError(`GitHub Login fehlgeschlagen: ${errorParam}`);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Kein Code vorhanden
      if (!code) {
        setError('Kein Autorisierungscode erhalten');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // State validieren (CSRF-Schutz)
      if (!validateState(state)) {
        setError('Ungültiger State-Parameter. Möglicher CSRF-Angriff.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Login mit GitHub Code
      try {
        await loginWithGitHub(code);
        navigate('/dashboard');
      } catch (err) {
        setError(err.toString());
        setTimeout(() => navigate('/login'), 3000);
      }
    };
    
    handleCallback();
  }, [searchParams, loginWithGitHub, navigate]);

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
              Sie werden in Kürze weitergeleitet...
            </Typography>
          </>
        ) : (
          <>
            <CircularProgress size={60} />
            <Typography variant="h6">
              GitHub Login wird verarbeitet...
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

export default GitHubCallback;
