import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Person,
  Cake,
  LocationCity,
  Event,
  Home,
  Badge,
  CheckCircle,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import groupService from '../../services/groupService';
import '../../assets/styles/pages/ViewGroup.scss';

const ViewGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, canManageAll } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroup();
  }, [id]);

  const loadGroup = async () => {
    try {
      setLoading(true);
      const data = await groupService.getGroup(id);
      setGroup(data);
    } catch (err) {
      setError('Fehler beim Laden der Gruppe: ' + (err.response?.data?.message || err.message));
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

  const canEdit = () => {
    return canManageAll() || group?.createdBy === user?.id;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !group) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Gruppe nicht gefunden'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Zurück
        </Button>
      </Container>
    );
  }

  return (
    <div className="view-group-page">
      <Container maxWidth="lg">
        <Box className="page-header">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            className="back-button"
          >
            Zurück
          </Button>
        </Box>

        <Paper className="group-info-paper">
          <Box className="group-header">
            <Box display="flex" alignItems="center" gap={2}>
              <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" gutterBottom>
                  {group.name}
                </Typography>
                {group.description && (
                  <Typography variant="body1" color="textSecondary">
                    {group.description}
                  </Typography>
                )}
              </Box>
            </Box>
            {canEdit() && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={() => navigate(`/groups/edit/${group.id}`)}
              >
                Bearbeiten
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="info-item">
                <Typography variant="caption" color="textSecondary">
                  Erstellt von
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {group.createdByUsername || 'Unbekannt'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="info-item">
                <Typography variant="caption" color="textSecondary">
                  Erstellt am
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {new Date(group.createdAt).toLocaleDateString('de-DE')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="info-item">
                <Typography variant="caption" color="textSecondary">
                  Mitglieder
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {group.members?.length || 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="info-item">
                <Typography variant="caption" color="textSecondary">
                  Einheit
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {group.unit ? `${group.unit.name}${group.unit.city ? ` - ${group.unit.city}` : ''}` : 'Keine Einheit'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="info-item">
                <Typography variant="caption" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label="Aktiv"
                  color="success"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper className="members-paper">
          <Typography variant="h5" gutterBottom className="members-title">
            Mitglieder ({group.members?.length || 0})
          </Typography>

          {group.members && group.members.length > 0 ? (
            <Grid container spacing={3}>
              {group.members.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={member.id || index}>
                  <Card className="member-card">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar className="member-avatar" sx={{ width: 56, height: 56 }}>
                          <Person />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                            {member.firstName} {member.lastName}
                          </Typography>
                          {member.gender && (
                            <Chip
                              label={member.gender === 'MALE' ? 'Männlich' : member.gender === 'FEMALE' ? 'Weiblich' : 'Divers'}
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Stack spacing={1.5}>
                        {member.unit && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <GroupIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              <strong>Einheit:</strong> {member.unit.name}
                              {member.unit.city && ` - ${member.unit.city}`}
                            </Typography>
                          </Box>
                        )}

                        {member.dateOfBirth && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Cake fontSize="small" color="action" />
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {calculateAge(member.dateOfBirth)} Jahre
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {member.cityOfBirth && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocationCity fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              {member.cityOfBirth}
                            </Typography>
                          </Box>
                        )}

                        {member.address && (member.address.street || member.address.city) && (
                          <Box display="flex" alignItems="start" gap={1}>
                            <Home fontSize="small" color="action" sx={{ mt: 0.5 }} />
                            <Typography variant="body2" color="textSecondary">
                              {member.address.street} {member.address.houseNumber}
                              <br />
                              {member.address.postalCode} {member.address.city}
                            </Typography>
                          </Box>
                        )}

                        {member.memberId && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Badge fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              ID: {member.memberId}
                            </Typography>
                          </Box>
                        )}

                        {member.membershipStartDate && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Event fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              Mitglied seit {new Date(member.membershipStartDate).toLocaleDateString('de-DE')}
                            </Typography>
                          </Box>
                        )}

                        {member.isAuthorizedToAccept && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <CheckCircle fontSize="small" color="success" />
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              Unterschriftsberechtigt
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="textSecondary">
                Keine Mitglieder in dieser Gruppe
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ViewGroup;
