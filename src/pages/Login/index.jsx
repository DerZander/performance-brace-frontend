import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert, Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography,} from '@mui/material';
import {Business, Email, LocalFireDepartment, Lock, Visibility, VisibilityOff,} from '@mui/icons-material';
import {useAuth} from '../../context/AuthContext';
import apiClient from '../../services/api';
import '../../assets/styles/pages/Login.scss';

const Login = () => {
    const navigate = useNavigate();
    const {login, register} = useAuth();

    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        unitId: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [units, setUnits] = useState([]);

    // Units laden, wenn auf Registrierung gewechselt wird
    useEffect(() => {
        if (isRegister) {
            loadUnits();
        }
    }, [isRegister]);

    const loadUnits = async () => {
        try {
            const response = await apiClient.get('/units/public');
            setUnits(response.data);
        } catch (err) {
            // Fehler ignorieren - Unit-Auswahl ist optional
        }
    };

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
                // Registrierung benötigt: email, password, firstName, lastName, unitId
                await register(
                    formData.email,
                    formData.password,
                    formData.firstName,
                    formData.lastName,
                    formData.unitId || null
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
                <Box className="login-container" sx={{px: {xs: 2, sm: 0}, py: {xs: 2, sm: 4}}}>
                    <Paper elevation={3} className="login-paper" sx={{p: {xs: 3, sm: 4}}}>
                        <Box className="login-header" sx={{mb: {xs: 2, sm: 3}}}>
                            <LocalFireDepartment className="fire-icon" sx={{fontSize: {xs: 40, sm: 50}}}/>
                            <Typography
                                variant="h4"
                                component="h1"
                                className="login-title"
                                sx={{fontSize: {xs: '1.5rem', sm: '2rem'}}}
                            >
                                Leistungsspange 2026
                            </Typography>
                            <Typography
                                variant="body1"
                                className="login-subtitle"
                                sx={{fontSize: {xs: '0.875rem', sm: '1rem'}}}
                            >
                                Bedburg Feuerwehr
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" className="login-alert" sx={{mb: 2}}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            {isRegister && (
                                <Stack spacing={2} direction={{xs: 'column', sm: 'row'}}>
                                    <TextField
                                        fullWidth
                                        label="Vorname"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        size="medium"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Nachname"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        size="medium"
                                    />
                                </Stack>
                            )}

                            {isRegister && (
                                <FormControl fullWidth variant="outlined" size="medium">
                                    <InputLabel>Einheit (optional)</InputLabel>
                                    <Select
                                        name="unitId"
                                        value={formData.unitId}
                                        onChange={handleChange}
                                        label="Einheit (optional)"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Business/>
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="">
                                            <em>Keine Einheit</em>
                                        </MenuItem>
                                        {units.map((unit) => (
                                            <MenuItem key={unit.id} value={unit.id}>
                                                {unit.name} {unit.city && `(${unit.city})`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                                size="medium"
                                helperText={isRegister ? "Gültige E-Mail-Adresse" : ""}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email/>
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
                                size="medium"
                                helperText={isRegister ? "Mindestens 6 Zeichen" : ""}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
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
                                sx={{mt: 2, mb: 1}}
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
                                        unitId: '',
                                    });
                                }}
                                className="toggle-button"
                                sx={{fontSize: {xs: '0.875rem', sm: '1rem'}}}
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
