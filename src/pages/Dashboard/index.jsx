import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Avatar, Box, Button, Card, CardActions, CardContent, Chip, Collapse, Container, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme,} from '@mui/material';
import {Add, Cake, Delete, Edit, Event, ExpandMore, Group as GroupIcon, KeyboardArrowDown, KeyboardArrowUp, LocationCity, Person,} from '@mui/icons-material';
import {useAuth} from '../../context/AuthContext';
import groupService from '../../services/groupService';
import '../../assets/styles/pages/Dashboard.scss';

const GroupRow = ({group, onEdit, onDelete}) => {
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
                        {open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                        <GroupIcon color="primary"/>
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
                        <Edit/>
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => onDelete(group.id)}
                        size="small"
                    >
                        <Delete/>
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={5}>
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
                                                                <Person/>
                                                            </Avatar>
                                                            <Typography variant="h6">
                                                                {member.firstName} {member.lastName}
                                                            </Typography>
                                                        </Box>

                                                        {member.unit && (
                                                            <Typography variant="body2" color="textSecondary">
                                                                <strong>Einheit:</strong> {member.unit.name}
                                                                {member.unit.city && ` - ${member.unit.city}`}
                                                            </Typography>
                                                        )}

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
                                                            <Cake fontSize="small" color="action"/>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
                                                            </Typography>
                                                        </Box>

                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Event fontSize="small" color="action"/>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Alter: {calculateAge(member.dateOfBirth)} Jahre
                                                            </Typography>
                                                        </Box>

                                                        {member.cityOfBirth && (
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <LocationCity fontSize="small" color="action"/>
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

// Mobile Card-Ansicht für Gruppen
const MobileGroupCard = ({group, onEdit, onDelete}) => {
    const [expanded, setExpanded] = useState(false);

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
        <Card sx={{mb: 2}}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1} flex={1}>
                        <GroupIcon color="primary"/>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                {group.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                Erstellt: {new Date(group.createdAt).toLocaleDateString('de-DE')}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label={`${group.members?.length || 0}`}
                        color="secondary"
                        size="small"
                        icon={<Person/>}
                    />
                </Box>

                {group.description && (
                    <Typography variant="body2" color="textSecondary" sx={{mb: 2}}>
                        {group.description}
                    </Typography>
                )}
            </CardContent>

            <CardActions sx={{justifyContent: 'space-between', px: 2, pb: 2}}>
                <Box>
                    <IconButton
                        color="primary"
                        onClick={() => onEdit(group)}
                        size="small"
                        sx={{mr: 1}}
                    >
                        <Edit/>
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => onDelete(group.id)}
                        size="small"
                    >
                        <Delete/>
                    </IconButton>
                </Box>
                <Button
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    endIcon={<ExpandMore sx={{transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.3s'}}/>}
                >
                    {expanded ? 'Weniger' : 'Mehr'}
                </Button>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{pt: 0}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Mitglieder ({group.members?.length || 0})
                    </Typography>
                    {group.members && group.members.length > 0 ? (
                        <Stack spacing={2}>
                            {group.members.map((member) => (
                                <Card key={member.id} variant="outlined" sx={{bgcolor: 'background.default'}}>
                                    <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <Avatar sx={{width: 32, height: 32, bgcolor: 'primary.main'}}>
                                                <Person fontSize="small"/>
                                            </Avatar>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {member.firstName} {member.lastName}
                                            </Typography>
                                        </Box>

                                        <Stack spacing={0.5} sx={{fontSize: '0.875rem'}}>
                                            {member.unit && (
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>🏢 Einheit:</strong> {member.unit.name}
                                                    {member.unit.city && ` - ${member.unit.city}`}
                                                </Typography>
                                            )}

                                            {member.gender && (
                                                <Typography variant="body2" color="textSecondary">
                                                    {member.gender === 'MALE' ? 'Männlich' : member.gender === 'FEMALE' ? 'Weiblich' : 'Divers'}
                                                </Typography>
                                            )}

                                            {member.memberId && (
                                                <Typography variant="body2" color="textSecondary">
                                                    ID: {member.memberId}
                                                </Typography>
                                            )}

                                            <Typography variant="body2" color="textSecondary">
                                                🎂 {new Date(member.dateOfBirth).toLocaleDateString('de-DE')} ({calculateAge(member.dateOfBirth)} Jahre)
                                            </Typography>

                                            {member.cityOfBirth && (
                                                <Typography variant="body2" color="textSecondary">
                                                    📍 {member.cityOfBirth}
                                                </Typography>
                                            )}

                                            {member.address && (member.address.street || member.address.city) && (
                                                <Typography variant="body2" color="textSecondary">
                                                    🏠 {member.address.street} {member.address.houseNumber}, {member.address.postalCode} {member.address.city}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Noch keine Mitglieder vorhanden
                        </Typography>
                    )}
                </CardContent>
            </Collapse>
        </Card>
    );
};


const Dashboard = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
                // Fehler wird durch UI behandelt
            }
        }
    };

    return (
        <div className="dashboard-page">
            <Container maxWidth="lg">
                <Box className="page-header" sx={{px: {xs: 2, sm: 3}}}>
                    <Typography variant="h1" sx={{fontSize: {xs: '1.75rem', sm: '2.5rem', md: '3rem'}}}>
                        Willkommen, {user?.firstName || 'Feuerwehrkamerad'}!
                    </Typography>
                    <Typography variant="body1" sx={{fontSize: {xs: '0.875rem', sm: '1rem'}}}>
                        Leistungsspange 2026 - Bedburg Feuerwehr
                    </Typography>
                </Box>

                <Box className="dashboard-actions" sx={{px: {xs: 2, sm: 0}, mb: 3}}>
                    <Button
                        variant="contained"
                        color="primary"
                        size={isMobile ? "medium" : "large"}
                        fullWidth={isMobile}
                        startIcon={<Add/>}
                        onClick={() => navigate('/groups/create')}
                        className="action-button"
                    >
                        Neue Gruppe erstellen
                    </Button>
                </Box>

                <Paper className="groups-paper" sx={{mx: {xs: 0, sm: 0}}}>
                    <Box className="groups-header" sx={{px: {xs: 2, sm: 3}, py: 2}}>
                        <Typography variant="h5" className="groups-title" sx={{fontSize: {xs: '1.25rem', sm: '1.5rem'}}}>
                            Meine Gruppen
                        </Typography>
                        <Chip
                            label={`${groups.length}`}
                            color="primary"
                            variant="outlined"
                            size={isMobile ? "small" : "medium"}
                        />
                    </Box>

                    {loading ? (
                        <Box className="loading-container" sx={{p: 3, textAlign: 'center'}}>
                            <Typography>Lade Gruppen...</Typography>
                        </Box>
                    ) : groups.length > 0 ? (
                        isMobile ? (
                            <Box sx={{px: 2, pb: 2}}>
                                {groups.map((group) => (
                                    <MobileGroupCard
                                        key={group.id}
                                        group={group}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="50px"/>
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
                        )
                    ) : (
                        <Box className="empty-state" sx={{p: {xs: 3, sm: 4}}}>
                            <GroupIcon className="empty-icon" sx={{fontSize: {xs: 60, sm: 80}}}/>
                            <Typography variant="h6" gutterBottom sx={{fontSize: {xs: '1.125rem', sm: '1.25rem'}}}>
                                Noch keine Gruppen vorhanden
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom sx={{mb: 2}}>
                                Erstellen Sie Ihre erste Gruppe für die Leistungsspange 2026
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Add/>}
                                fullWidth={isMobile}
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
