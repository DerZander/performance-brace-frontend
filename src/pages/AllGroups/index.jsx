import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import groupService from '../../services/groupService';
import exportService from '../../services/exportService';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import './AllGroups.scss';

const AllGroups = () => {
  const { canManageAll } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportingGroupId, setExportingGroupId] = useState(null);

  useEffect(() => {
    if (!canManageAll()) {
      navigate('/dashboard');
      return;
    }
    loadGroups();
  }, [canManageAll, navigate]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await groupService.getAllGroupsForAdmins();
      setGroups(data);
    } catch (err) {
      setError('Fehler beim Laden der Gruppen: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    try {
      setExporting(true);
      setError('');
      await exportService.exportAllGroups();
    } catch (err) {
      setError('Fehler beim Excel-Export: ' + (err.response?.data?.message || err.message));
    } finally {
      setExporting(false);
    }
  };

  const handleExportSingle = async (groupId) => {
    try {
      setExportingGroupId(groupId);
      setError('');
      await exportService.exportSingleGroup(groupId);
    } catch (err) {
      setError('Fehler beim Excel-Export: ' + (err.response?.data?.message || err.message));
    } finally {
      setExportingGroupId(null);
    }
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (!window.confirm(`Möchten Sie die Gruppe "${groupName}" wirklich löschen?`)) {
      return;
    }

    try {
      await groupService.deleteGroup(groupId);
      setGroups(groups.filter((g) => g.id !== groupId));
    } catch (err) {
      setError('Fehler beim Löschen: ' + (err.response?.data?.message || err.message));
    }
  };

  const getTotalMembers = () => {
    return groups.reduce((sum, group) => sum + group.members.length, 0);
  };

  if (!canManageAll()) {
    return null;
  }

  return (
    <Container maxWidth="xl" className="all-groups-page">
      <Box className="page-header">
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            <GroupIcon sx={{ fontSize: 40, mr: 2, verticalAlign: 'middle' }} />
            Alle Gruppen
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Übersicht aller Gruppen im System
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
          onClick={handleExportAll}
          disabled={exporting || groups.length === 0}
          sx={{ minWidth: 200 }}
        >
          {exporting ? 'Wird exportiert...' : 'Alle als Excel exportieren'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box className="statistics-box">
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box className="stat-item">
                  <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4">{groups.length}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gruppen gesamt
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="stat-item">
                  <PersonIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h4">{getTotalMembers()}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mitglieder gesamt
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="stat-item">
                  <DownloadIcon sx={{ fontSize: 40, color: 'info.main' }} />
                  <Box>
                    <Typography variant="h4">Excel</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Export verfügbar
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      ) : groups.length === 0 ? (
        <Alert severity="info">
          Keine Gruppen vorhanden. Erstellen Sie eine neue Gruppe im Dashboard.
        </Alert>
      ) : (
        <Grid container spacing={3} className="groups-grid">
          {groups.map((group) => (
            <Grid item xs={12} md={6} lg={4} key={group.id}>
              <Card className="group-card">
                <CardContent>
                  <Box className="card-header">
                    <Typography variant="h5" component="h2" gutterBottom>
                      {group.name}
                    </Typography>
                    <Chip
                      label={`${group.members.length} Mitglieder`}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  {group.description && (
                    <Typography variant="body2" color="text.secondary" className="description">
                      {group.description}
                    </Typography>
                  )}

                  <Box className="group-info">
                    <Typography variant="caption" color="text.secondary">
                      <strong>Erstellt von:</strong> {group.createdByUsername}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Erstellt am:</strong>{' '}
                      {new Date(group.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                    {group.unit && (
                      <Typography variant="caption" color="text.secondary">
                        <strong>Einheit:</strong> {group.unit.name}{group.unit.city ? ` - ${group.unit.city}` : ''}
                      </Typography>
                    )}
                  </Box>

                  <Box className="members-preview">
                    <Typography variant="subtitle2" gutterBottom>
                      Mitglieder:
                    </Typography>
                    {group.members.slice(0, 3).map((member, index) => (
                      <Typography key={index} variant="body2" color="text.secondary">
                        • {member.firstName} {member.lastName}
                      </Typography>
                    ))}
                    {group.members.length > 3 && (
                      <Typography variant="body2" color="primary">
                        ... und {group.members.length - 3} weitere
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <CardActions className="card-actions">
                  <Tooltip title="Gruppe anzeigen">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/groups/${group.id}`)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Als Excel exportieren">
                    <IconButton
                      color="success"
                      onClick={() => handleExportSingle(group.id)}
                      disabled={exportingGroupId === group.id}
                      size="small"
                    >
                      {exportingGroupId === group.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DownloadIcon />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Gruppe löschen">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteGroup(group.id, group.name)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AllGroups;

