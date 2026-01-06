import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {AdminPanelSettings, Business, Delete, Edit, Group, Person, SupervisedUserCircle,} from '@mui/icons-material';
import {useAuth} from '../../context/AuthContext';
import adminService from '../../services/adminService';
import unitService from '../../services/unitService';
import '../../assets/styles/pages/ManageUsers.scss';

const ManageUsers = () => {
    const {user: currentUser, isAdmin} = useAuth();
    const [users, setUsers] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [unitDialogOpen, setUnitDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbar({open: true, message, severity});
    }, []);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Fehler beim Laden der Benutzer:', error);
            showSnackbar('Fehler beim Laden der Benutzer', 'error');
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    const loadUnits = useCallback(async () => {
        try {
            const data = await unitService.getAllUnits();
            setUnits(data);
        } catch (error) {
            // Fehler ignorieren - Units sind optional
        }
    }, []);

    useEffect(() => {
        loadUsers();
        loadUnits();
    }, [loadUsers, loadUnits]);

    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false});
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setEditDialogOpen(true);
    };

    const handleUnitClick = (user) => {
        setSelectedUser(user);
        setSelectedUnit(user.unit?.id || '');
        setUnitDialogOpen(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setSelectedUser(null);
        setSelectedRole('');
    };

    const handleUnitClose = () => {
        setUnitDialogOpen(false);
        setSelectedUser(null);
        setSelectedUnit('');
    };

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    const handleRoleUpdate = async () => {
        try {
            await adminService.updateUserRole(selectedUser.id, selectedRole);
            showSnackbar('Benutzerrolle erfolgreich aktualisiert');
            loadUsers();
            handleEditClose();
        } catch (error) {
            showSnackbar('Fehler beim Aktualisieren der Rolle', 'error');
        }
    };

    const handleUnitUpdate = async () => {
        try {
            if (selectedUnit) {
                await adminService.updateUserUnit(selectedUser.id, parseInt(selectedUnit));
                showSnackbar('Einheit erfolgreich zugewiesen');
            } else {
                showSnackbar('Bitte wählen Sie eine Einheit aus', 'warning');
                return;
            }
            loadUsers();
            handleUnitClose();
        } catch (error) {
            showSnackbar('Fehler beim Zuweisen der Einheit', 'error');
        }
    };

    const handleUserDelete = async () => {
        try {
            await adminService.deleteUser(selectedUser.id);
            showSnackbar('Benutzer erfolgreich gelöscht');
            loadUsers();
            handleDeleteClose();
        } catch (error) {
            showSnackbar('Fehler beim Löschen des Benutzers', 'error');
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN':
                return <AdminPanelSettings fontSize="small"/>;
            case 'KREISJUGENDWART':
                return <SupervisedUserCircle fontSize="small"/>;
            case 'JUGENDWART':
                return <Group fontSize="small"/>;
            default:
                return <Person fontSize="small"/>;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'error';
            case 'KREISJUGENDWART':
                return 'warning';
            case 'JUGENDWART':
                return 'primary';
            default:
                return 'default';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'Administrator';
            case 'KREISJUGENDWART':
                return 'Kreisjugendwart';
            case 'JUGENDWART':
                return 'Jugendwart';
            default:
                return role;
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" className="manage-users-container">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress/>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" className="manage-users-container">
            <Box className="header-section">
                <Typography variant="h4" className="page-title">
                    Benutzerverwaltung
                </Typography>
                <Typography variant="body1" color="textSecondary" className="page-subtitle">
                    Verwalte Benutzer und ihre Rollen
                </Typography>
            </Box>

            <Paper elevation={3} className="users-table-paper">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>E-Mail</TableCell>
                                <TableCell>Rolle</TableCell>
                                <TableCell>Einheit</TableCell>
                                <TableCell>Registriert</TableCell>
                                <TableCell align="right">Aktionen</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="user-row">
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Person color="action"/>
                                            <Typography variant="body1">
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={getRoleIcon(user.role)}
                                            label={getRoleLabel(user.role)}
                                            color={getRoleColor(user.role)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {user.unit ? (
                                            <Chip
                                                icon={<Business fontSize="small"/>}
                                                label={user.unit.name}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Keine Einheit
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString('de-DE')}
                                    </TableCell>
                                    <TableCell align="right">
                                        {isAdmin() && user.id !== currentUser?.id && (
                                            <>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditClick(user)}
                                                    size="small"
                                                    title="Rolle bearbeiten"
                                                >
                                                    <Edit/>
                                                </IconButton>
                                                <IconButton
                                                    color="info"
                                                    onClick={() => handleUnitClick(user)}
                                                    size="small"
                                                    title="Einheit zuweisen"
                                                >
                                                    <Business/>
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteClick(user)}
                                                    size="small"
                                                    title="Benutzer löschen"
                                                >
                                                    <Delete/>
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Edit Role Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Benutzerrolle bearbeiten</DialogTitle>
                <DialogContent>
                    <Box pt={2}>
                        <Typography variant="body2" gutterBottom>
                            Benutzer: <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>
                        </Typography>
                        <Typography variant="body2" gutterBottom mb={3}>
                            E-Mail: <strong>{selectedUser?.email}</strong>
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Rolle</InputLabel>
                            <Select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                label="Rolle"
                                variant="outlined"
                            >
                                <MenuItem value="JUGENDWART">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Group fontSize="small"/>
                                        Jugendwart
                                    </Box>
                                </MenuItem>
                                <MenuItem value="KREISJUGENDWART">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <SupervisedUserCircle fontSize="small"/>
                                        Kreisjugendwart
                                    </Box>
                                </MenuItem>
                                <MenuItem value="ADMIN">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <AdminPanelSettings fontSize="small"/>
                                        Administrator
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Abbrechen</Button>
                    <Button
                        onClick={handleRoleUpdate}
                        variant="contained"
                        color="primary"
                        disabled={!selectedRole || selectedRole === selectedUser?.role}
                    >
                        Speichern
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Assign Unit Dialog */}
            <Dialog open={unitDialogOpen} onClose={handleUnitClose} maxWidth="sm" fullWidth>
                <DialogTitle>Einheit zuweisen</DialogTitle>
                <DialogContent>
                    <Box pt={2}>
                        <Typography variant="body2" gutterBottom>
                            Benutzer: <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>
                        </Typography>
                        <Typography variant="body2" gutterBottom mb={3}>
                            E-Mail: <strong>{selectedUser?.email}</strong>
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Einheit</InputLabel>
                            <Select
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                label="Einheit"
                                variant="outlined"
                            >
                                <MenuItem value="">
                                    <em>Keine Einheit</em>
                                </MenuItem>
                                {units.map((unit) => (
                                    <MenuItem key={unit.id} value={unit.id}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Business fontSize="small"/>
                                            {unit.name}
                                            {unit.city && (
                                                <Typography variant="caption" color="text.secondary">
                                                    ({unit.city})
                                                </Typography>
                                            )}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUnitClose}>Abbrechen</Button>
                    <Button
                        onClick={handleUnitUpdate}
                        variant="contained"
                        color="primary"
                        disabled={!selectedUnit}
                    >
                        Zuweisen
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="sm" fullWidth>
                <DialogTitle>Benutzer löschen</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{mb: 2}}>
                        Diese Aktion kann nicht rückgängig gemacht werden!
                    </Alert>
                    <Typography variant="body1">
                        Möchten Sie den Benutzer <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> ({selectedUser?.email}) wirklich löschen?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>Abbrechen</Button>
                    <Button
                        onClick={handleUserDelete}
                        variant="contained"
                        color="error"
                    >
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ManageUsers;

