import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
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
  LocalFireDepartment,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/pages/Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

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
        // Registrierung benötigt: email, password, firstName, lastName
        await register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
      } else {
        // Login benötigt nur: email, password
        console.log('Logging in with:', formData);
        await login(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.toString());
    } finally {
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
                helperText={isRegister ? "Gültige E-Mail-Adresse" : ""}
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
                helperText={isRegister ? "Mindestens 6 Zeichen" : ""}
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
                  // Reset form when switching
                  setFormData({
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                  });
                }}
                className="toggle-button"
              >
                {isRegister
                  ? 'Bereits registriert? Jetzt anmelden'
                  : 'Noch kein Konto? Jetzt registrieren'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
