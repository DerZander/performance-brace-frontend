import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  Card,
  CardContent,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Add,
  Delete,
  Person,
} from '@mui/icons-material';
import groupService from '../../services/groupService';
import '../../assets/styles/pages/CreateGroup.scss';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [members, setMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    cityOfBirth: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadGroup();
    }
  }, [id]);

  const loadGroup = async () => {
    try {
      const group = await groupService.getGroup(id);
      setFormData({
        name: group.name,
        description: group.description || '',
      });
      setMembers(group.members || []);
    } catch (error) {
      setError('Fehler beim Laden der Gruppe');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMemberChange = (e) => {
    setCurrentMember({
      ...currentMember,
      [e.target.name]: e.target.value,
    });
  };

  const addMember = () => {
    if (
      currentMember.firstName &&
      currentMember.lastName &&
      currentMember.dateOfBirth &&
      currentMember.cityOfBirth
    ) {
      setMembers([...members, { ...currentMember, id: Date.now() }]);
      setCurrentMember({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        cityOfBirth: '',
      });
      setSuccess('Mitglied hinzugefügt');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Bitte alle Felder ausfüllen');
      setTimeout(() => setError(''), 3000);
    }
  };

  const removeMember = (memberId) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name) {
      setError('Bitte geben Sie einen Gruppennamen ein');
      return;
    }

    setLoading(true);

    try {
      const groupData = {
        ...formData,
        members,
      };
      console.log('Submitting group data:', groupData);
      if (isEdit) {
        await groupService.updateGroup(id, groupData);
        setSuccess('Gruppe erfolgreich aktualisiert');
      } else {
        await groupService.createGroup(groupData);
        setSuccess('Gruppe erfolgreich erstellt');
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="create-group-page">
      <Container maxWidth="lg">
        <Box className="page-header">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard')}
            className="back-button"
          >
            Zurück zum Dashboard
          </Button>
          <Typography variant="h1">
            {isEdit ? 'Gruppe bearbeiten' : 'Neue Gruppe erstellen'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="alert-box">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="alert-box">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Paper className="form-paper">
            <Typography variant="h5" className="section-title">
              Gruppeninformationen
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Gruppenname"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Beschreibung (optional)"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper className="form-paper">
            <Typography variant="h5" className="section-title">
              Mitglieder hinzufügen
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vorname"
                  name="firstName"
                  value={currentMember.firstName}
                  onChange={handleMemberChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nachname"
                  name="lastName"
                  value={currentMember.lastName}
                  onChange={handleMemberChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Geburtsdatum"
                  name="dateOfBirth"
                  type="date"
                  value={currentMember.dateOfBirth}
                  onChange={handleMemberChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Geburtsort"
                  name="cityOfBirth"
                  value={currentMember.cityOfBirth}
                  onChange={handleMemberChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Add />}
                  onClick={addMember}
                  fullWidth
                  className="add-member-button"
                >
                  Mitglied hinzufügen
                </Button>
              </Grid>
            </Grid>

            {members.length > 0 && (
              <>
                <Divider className="divider" />
                <Typography variant="h6" className="members-list-title">
                  Hinzugefügte Mitglieder ({members.length})
                </Typography>

                <Grid container spacing={2}>
                  {members.map((member) => (
                    <Grid item xs={12} sm={6} md={4} key={member.id}>
                      <Card className="member-card">
                        <CardContent>
                          <Box className="member-card-header">
                            <Person color="primary" />
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeMember(member.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>

                          <Typography variant="h6" className="member-name">
                            {member.firstName} {member.lastName}
                          </Typography>

                          <Stack spacing={0.5} className="member-info">
                            <Typography variant="body2" color="textSecondary">
                              Geboren: {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Alter: {calculateAge(member.dateOfBirth)} Jahre
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Ort: {member.cityOfBirth}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Paper>

          <Box className="form-actions">
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? 'Wird gespeichert...' : isEdit ? 'Änderungen speichern' : 'Gruppe erstellen'}
            </Button>
          </Box>
        </form>
      </Container>
    </div>
  );
};

export default CreateGroup;
