import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Add,
  Edit,
  Delete,
  Group as GroupIcon,
  Person,
  Cake,
  LocationCity,
  Event,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import groupService from '../../services/groupService';
import '../../assets/styles/pages/Dashboard.scss';

const GroupRow = ({ group, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

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
    <>
      <TableRow className="group-row">
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <GroupIcon color="primary" />
            <Typography variant="body1" fontWeight={600}>
              {group.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Chip
            label={`${group.members?.length || 0} Mitglieder`}
            color="secondary"
            size="small"
          />
        </TableCell>
        <TableCell>
          {new Date(group.createdAt).toLocaleDateString('de-DE')}
        </TableCell>
        <TableCell align="right">
          <IconButton
            color="primary"
            onClick={() => onEdit(group)}
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDelete(group.id)}
            size="small"
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="members-container">
              <Typography variant="h6" gutterBottom className="members-title">
                Mitglieder
              </Typography>
              {group.members && group.members.length > 0 ? (
                <Grid container spacing={2}>
                  {group.members.map((member) => (
                    <Grid item xs={12} sm={6} md={4} key={member.id}>
                      <Card className="member-card">
                        <CardContent>
                          <Stack spacing={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar className="member-avatar">
                                <Person />
                              </Avatar>
                              <Typography variant="h6">
                                {member.firstName} {member.lastName}
                              </Typography>
                            </Box>
                            
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

                            <Box display="flex" alignItems="center" gap={1}>
                              <Cake fontSize="small" color="action" />
                              <Typography variant="body2" color="textSecondary">
                                {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                              <Event fontSize="small" color="action" />
                              <Typography variant="body2" color="textSecondary">
                                Alter: {calculateAge(member.dateOfBirth)} Jahre
                              </Typography>
                            </Box>

                            {member.cityOfBirth && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <LocationCity fontSize="small" color="action" />
                                <Typography variant="body2" color="textSecondary">
                                  {member.cityOfBirth}
                                </Typography>
                              </Box>
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
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Noch keine Mitglieder vorhanden
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Fehler beim Laden der Gruppen:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (group) => {
    navigate(`/groups/edit/${group.id}`);
  };

  const handleDelete = async (groupId) => {
    if (window.confirm('Möchten Sie diese Gruppe wirklich löschen?')) {
      try {
        await groupService.deleteGroup(groupId);
        loadGroups();
      } catch (error) {
        console.error('Fehler beim Löschen der Gruppe:', error);
      }
    }
  };

  return (
    <div className="dashboard-page">
      <Container maxWidth="lg">
        <Box className="page-header">
          <Typography variant="h1">
            Willkommen, {user?.firstName || 'Feuerwehrkamerad'}!
          </Typography>
          <Typography variant="body1">
            Leistungsspange 2026 - Bedburg Feuerwehr
          </Typography>
        </Box>

        <Box className="dashboard-actions">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate('/groups/create')}
            className="action-button"
          >
            Neue Gruppe erstellen
          </Button>
        </Box>

        <Paper className="groups-paper">
          <Box className="groups-header">
            <Typography variant="h5" className="groups-title">
              Meine Gruppen
            </Typography>
            <Chip
              label={`${groups.length} Gruppe(n)`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {loading ? (
            <Box className="loading-container">
              <Typography>Lade Gruppen...</Typography>
            </Box>
          ) : groups.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="50px" />
                    <TableCell>Gruppenname</TableCell>
                    <TableCell>Anzahl Mitglieder</TableCell>
                    <TableCell>Erstellt am</TableCell>
                    <TableCell align="right">Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groups.map((group) => (
                    <GroupRow
                      key={group.id}
                      group={group}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box className="empty-state">
              <GroupIcon className="empty-icon" />
              <Typography variant="h6" gutterBottom>
                Noch keine Gruppen vorhanden
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Erstellen Sie Ihre erste Gruppe für die Leistungsspange 2026
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => navigate('/groups/create')}
              >
                Erste Gruppe erstellen
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Dashboard;
