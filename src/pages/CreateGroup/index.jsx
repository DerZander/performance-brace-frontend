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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Add,
  Delete,
  Person,
  Edit,
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
    gender: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    cityOfBirth: '',
    address: {
      street: '',
      houseNumber: '',
      city: '',
      postalCode: '',
    },
    memberId: '',
    membershipStartDate: '',
  });
  const [editingMember, setEditingMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    } catch {
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
    const { name, value, type, checked } = e.target;

    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setCurrentMember({
        ...currentMember,
        address: {
          ...currentMember.address,
          [addressField]: value,
        },
      });
    } else {
      setCurrentMember({
        ...currentMember,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    if (editingMember) {
      cancelEdit();
    }
  };

  const addMember = () => {
    if (
      currentMember.firstName &&
      currentMember.lastName &&
      currentMember.dateOfBirth
    ) {
      if (editingMember !== null) {
        // Bearbeiten eines existierenden Mitglieds
        setMembers(members.map((m) => 
          m.id === editingMember.id ? { ...currentMember, id: editingMember.id } : m
        ));
        setSuccess('Mitglied aktualisiert');
        setEditingMember(null);
      } else {
        // Neues Mitglied hinzufügen
        setMembers([...members, { ...currentMember, id: Date.now() }]);
        setSuccess('Mitglied hinzugefügt');
      }
      setCurrentMember({
        gender: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        cityOfBirth: '',
        address: {
          street: '',
          houseNumber: '',
          city: '',
          postalCode: '',
        },
        memberId: '',
        membershipStartDate: '',
      });
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Bitte Vorname, Nachname und Geburtsdatum ausfüllen');
      setTimeout(() => setError(''), 3000);
    }
  };

  const editMember = (member) => {
    setCurrentMember({
      gender: member.gender || '',
      firstName: member.firstName,
      lastName: member.lastName,
      dateOfBirth: member.dateOfBirth,
      cityOfBirth: member.cityOfBirth || '',
      address: member.address || {
        street: '',
        houseNumber: '',
        city: '',
        postalCode: '',
      },
      memberId: member.memberId || '',
      membershipStartDate: member.membershipStartDate || '',
    });
    setEditingMember(member);
    setModalOpen(true);
  };

  const cancelEdit = () => {
    setCurrentMember({
      gender: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      cityOfBirth: '',
      address: {
        street: '',
        houseNumber: '',
        city: '',
        postalCode: '',
      },
      memberId: '',
      membershipStartDate: '',
    });
    setEditingMember(null);
  };

  const removeMember = (memberId) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    console.log('Form data before submission:', formData, members);
    if (!formData.name) {
      setError('Bitte geben Sie einen Gruppennamen ein');
      return;
    }

    setLoading(true);

    try {
      // Entferne IDs von Members, die nur temporär vom Frontend vergeben wurden
      const cleanedMembers = members.map(member => {
        const { id, ...memberWithoutId } = member;
        // Nur echte DB-IDs (die vom Backend kommen) behalten
        if (id && id < 10000000000) { // DB IDs sind kleiner als Date.now() IDs
          return member;
        }
        return memberWithoutId;
      });

      const groupData = {
        ...formData,
        members: cleanedMembers,
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" className="section-title">
                Mitglieder
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={openModal}
              >
                Mitglied hinzufügen
              </Button>
            </Box>

            {members.length > 0 ? (
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
                            <Box>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => editMember(member)}
                                title="Bearbeiten"
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeMember(member.id)}
                                title="Löschen"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>

                          <Typography variant="h6" className="member-name">
                            {member.firstName} {member.lastName}
                          </Typography>

                          <Stack spacing={0.5} className="member-info">
                            {member.gender && (
                              <Typography variant="body2" color="textSecondary">
                                Geschlecht: {member.gender === 'MALE' ? 'Männlich' : member.gender === 'FEMALE' ? 'Weiblich' : 'Divers'}
                              </Typography>
                            )}
                            {member.memberId && (
                              <Typography variant="body2" color="textSecondary">
                                Mitglieds-ID: {member.memberId}
                              </Typography>
                            )}
                            <Typography variant="body2" color="textSecondary">
                              Geboren: {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Alter: {calculateAge(member.dateOfBirth)} Jahre
                            </Typography>
                            {member.cityOfBirth && (
                              <Typography variant="body2" color="textSecondary">
                                Geburtsort: {member.cityOfBirth}
                              </Typography>
                            )}
                            {member.membershipStartDate && (
                              <Typography variant="body2" color="textSecondary">
                                Mitglied seit: {new Date(member.membershipStartDate).toLocaleDateString('de-DE')}
                              </Typography>
                            )}
                            {member.address && (member.address.street || member.address.city) && (
                              <Typography variant="body2" color="textSecondary">
                                Adresse: {member.address.street} {member.address.houseNumber}, {member.address.postalCode} {member.address.city}
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Typography variant="body1" color="textSecondary" textAlign="center" py={3}>
                Noch keine Mitglieder hinzugefügt. Klicken Sie auf "Mitglied hinzufügen", um zu beginnen.
              </Typography>
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

        {/* Modal für Mitglied hinzufügen/bearbeiten */}
        <Dialog open={modalOpen} onClose={closeModal} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingMember ? 'Mitglied bearbeiten' : 'Neues Mitglied hinzufügen'}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ py: 1 }}>
              {/* Persönliche Informationen */}
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}>
                Persönliche Informationen
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    select
                    label="Geschlecht"
                    name="gender"
                    value={currentMember.gender}
                    onChange={handleMemberChange}
                    variant="outlined"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value=""></option>
                    <option value="MALE">Männlich</option>
                    <option value="FEMALE">Weiblich</option>
                    <option value="OTHER">Divers</option>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Vorname"
                    name="firstName"
                    value={currentMember.firstName}
                    onChange={handleMemberChange}
                    variant="outlined"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Nachname"
                    name="lastName"
                    value={currentMember.lastName}
                    onChange={handleMemberChange}
                    variant="outlined"
                    required
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
                    required
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
              </Grid>

              {/* Mitgliedschaftsinformationen */}
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 3, mb: 2 }}>
                Mitgliedschaftsinformationen
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mitglieds-ID"
                    name="memberId"
                    value={currentMember.memberId}
                    onChange={handleMemberChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mitgliedschaft seit"
                    name="membershipStartDate"
                    type="date"
                    value={currentMember.membershipStartDate}
                    onChange={handleMemberChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              {/* Adresse */}
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 3, mb: 2 }}>
                Adresse
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    label="Straße"
                    name="address.street"
                    value={currentMember.address.street}
                    onChange={handleMemberChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Hausnummer"
                    name="address.houseNumber"
                    value={currentMember.address.houseNumber}
                    onChange={handleMemberChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="PLZ"
                    name="address.postalCode"
                    value={currentMember.address.postalCode}
                    onChange={handleMemberChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Ort"
                    name="address.city"
                    value={currentMember.address.city}
                    onChange={handleMemberChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} color="inherit">
              Abbrechen
            </Button>
            <Button 
              onClick={addMember} 
              variant="contained" 
              color="primary"
              startIcon={editingMember ? <Save /> : <Add />}
            >
              {editingMember ? 'Änderungen speichern' : 'Mitglied hinzufügen'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default CreateGroup;
