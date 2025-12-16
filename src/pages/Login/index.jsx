import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Facebook,
  GitHub,
  LocalFireDepartment,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/pages/Login.scss';
import apiClient from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook, loginWithGitHub } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await login(formData.email, formData.password, formData.firstName, formData.lastName);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setLoading(true);
    
    try {
      // Weiterleitung zum OAuth2 Endpunkt
      window.location.href = `http://localhost:8080/api/oauth2/authorization/${provider}`;
    } catch (err) {
      setError(err.response?.data?.message || `${provider} Login fehlgeschlagen`);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container maxWidth="sm">
        <Box className="login-container">
          <Paper elevation={3} className="login-paper">
            <Box className="login-header">
              <LocalFireDepartment className="fire-icon" />
              <Typography variant="h4" component="h1" className="login-title">
                Leistungsspange 2026
              </Typography>
              <Typography variant="body1" className="login-subtitle">
                Bedburg Feuerwehr
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" className="login-alert">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {isRegister && (
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <TextField
                    fullWidth
                    label="Vorname"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Nachname"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Stack>
              )}

              <TextField
                fullWidth
                label="E-Mail"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Passwort"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                className="submit-button"
              >
                {loading ? 'Bitte warten...' : isRegister ? 'Registrieren' : 'Anmelden'}
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="toggle-button"
              >
                {isRegister
                  ? 'Bereits registriert? Jetzt anmelden'
                  : 'Noch kein Konto? Jetzt registrieren'}
              </Button>
            </form>

            <Divider className="login-divider">
              <Typography variant="body2" color="textSecondary">
                Oder anmelden mit
              </Typography>
            </Divider>

            <Stack spacing={2} className="social-buttons">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="social-button google"
              >
                Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className="social-button facebook"
              >
                Facebook
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
                className="social-button github"
              >
                GitHub
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
