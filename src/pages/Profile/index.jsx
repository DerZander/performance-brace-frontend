import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import profileService from '../../services/profileService';
import './Profile.scss';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profil-Formulardaten
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Passwort-Formulardaten
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Dialog-States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
      setProfileForm({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    } catch (err) {
      setError('Fehler beim Laden des Profils: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const updatedProfile = await profileService.updateProfile(profileForm);
      setProfile(updatedProfile);
      setSuccess('Profil erfolgreich aktualisiert!');

      // Update localStorage wenn E-Mail geändert wurde
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.firstName = updatedProfile.firstName;
      storedUser.lastName = updatedProfile.lastName;
      storedUser.email = updatedProfile.email;
      localStorage.setItem('user', JSON.stringify(storedUser));
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler beim Aktualisieren des Profils');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validierung
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Die neuen Passwörter stimmen nicht überein');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Das neue Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    try {
      await profileService.changePassword(passwordForm);
      setSuccess('Passwort erfolgreich geändert!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler beim Ändern des Passworts');
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await profileService.deleteProfile();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler beim Löschen des Profils');
      setOpenDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Laden...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="profile-page">
      <Typography variant="h4" gutterBottom>
        Mein Profil
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profil-Informationen */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Persönliche Daten
            </Typography>
            <Box component="form" onSubmit={handleProfileUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Vorname"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nachname"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-Mail"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Profil aktualisieren
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Passwort ändern */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Passwort ändern
            </Typography>
            <Box component="form" onSubmit={handlePasswordChange}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Aktuelles Passwort"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Neues Passwort"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Neues Passwort bestätigen"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Passwort ändern
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Account löschen */}
          <Paper sx={{ p: 3, backgroundColor: '#ffebee' }}>
            <Typography variant="h6" gutterBottom color="error">
              Gefahrenzone
            </Typography>
            <Typography variant="body2" gutterBottom>
              Das Löschen Ihres Accounts ist permanent und kann nicht rückgängig gemacht werden.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenDeleteDialog(true)}
              sx={{ mt: 2 }}
            >
              Account löschen
            </Button>
          </Paper>
        </Grid>

        {/* Profil-Übersicht Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profil-Übersicht
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">
                  {profile?.firstName} {profile?.lastName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  E-Mail
                </Typography>
                <Typography variant="body1">{profile?.email}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Rolle
                </Typography>
                <Chip label={profile?.role} color="primary" size="small" />
              </Box>

              {profile?.unit && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Einheit
                  </Typography>
                  <Typography variant="body1">{profile.unit.name}</Typography>
                  {profile.unit.city && (
                    <Typography variant="body2" color="text.secondary">
                      {profile.unit.city}
                    </Typography>
                  )}
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Mitglied seit
                </Typography>
                <Typography variant="body2">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('de-DE') : '-'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Account löschen?</DialogTitle>
        <DialogContent>
          <Typography>
            Sind Sie sicher, dass Sie Ihren Account permanent löschen möchten?
            Diese Aktion kann nicht rückgängig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Abbrechen</Button>
          <Button onClick={handleDeleteProfile} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;

