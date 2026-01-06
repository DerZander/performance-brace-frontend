import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,} from '@mui/material';
import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon} from '@mui/icons-material';
import unitService from '../../services/unitService';
import './ManageUnits.scss';

const ManageUnits = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog States
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [deletingUnit, setDeletingUnit] = useState(null);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        city: '',
    });

    useEffect(() => {
        loadUnits();
    }, []);

    const loadUnits = async () => {
        try {
            setLoading(true);
            const data = await unitService.getAllUnits();
            setUnits(data);
        } catch (err) {
            setError('Fehler beim Laden der Einheiten: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (unit = null) => {
        if (unit) {
            setEditingUnit(unit);
            setFormData({
                name: unit.name,
                description: unit.description || '',
                city: unit.city || '',
            });
        } else {
            setEditingUnit(null);
            setFormData({
                name: '',
                description: '',
                city: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUnit(null);
        setFormData({
            name: '',
            description: '',
            city: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingUnit) {
                await unitService.updateUnit(editingUnit.id, formData);
                setSuccess('Einheit erfolgreich aktualisiert!');
            } else {
                await unitService.createUnit(formData);
                setSuccess('Einheit erfolgreich erstellt!');
            }
            handleCloseDialog();
            loadUnits();
        } catch (err) {
            setError(err.response?.data?.message || 'Fehler beim Speichern der Einheit');
        }
    };

    const handleOpenDeleteDialog = (unit) => {
        setDeletingUnit(unit);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingUnit(null);
    };

    const handleDelete = async () => {
        if (!deletingUnit) return;

        setError('');
        setSuccess('');

        try {
            await unitService.deleteUnit(deletingUnit.id);
            setSuccess('Einheit erfolgreich gelöscht!');
            handleCloseDeleteDialog();
            loadUnits();
        } catch (err) {
            setError(err.response?.data?.message || 'Fehler beim Löschen der Einheit');
            handleCloseDeleteDialog();
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                <Typography>Laden...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{mt: 4, mb: 4}} className="manage-units-page">
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h4">
                    Einheiten verwalten
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon/>}
                    onClick={() => handleOpenDialog()}
                >
                    Neue Einheit
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{mb: 2}} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{mb: 2}} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Beschreibung</strong></TableCell>
                            <TableCell><strong>Standort</strong></TableCell>
                            <TableCell><strong>Erstellt am</strong></TableCell>
                            <TableCell align="right"><strong>Aktionen</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {units.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Keine Einheiten vorhanden. Erstellen Sie die erste Einheit!
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            units.map((unit) => (
                                <TableRow key={unit.id} hover>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="600">
                                            {unit.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{unit.description || '-'}</TableCell>
                                    <TableCell>{unit.city || '-'}</TableCell>
                                    <TableCell>
                                        {unit.createdAt ? new Date(unit.createdAt).toLocaleDateString('de-DE') : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenDialog(unit)}
                                            title="Bearbeiten"
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleOpenDeleteDialog(unit)}
                                            title="Löschen"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingUnit ? 'Einheit bearbeiten' : 'Neue Einheit erstellen'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            sx={{mb: 2}}
                        />
                        <TextField
                            fullWidth
                            label="Beschreibung"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            multiline
                            rows={3}
                            sx={{mb: 2}}
                        />
                        <TextField
                            fullWidth
                            label="Standort"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Abbrechen</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingUnit ? 'Aktualisieren' : 'Erstellen'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Einheit löschen?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Möchten Sie die Einheit <strong>{deletingUnit?.name}</strong> wirklich löschen?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Abbrechen</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageUnits;

