import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  LocalFireDepartment,
  Dashboard as DashboardIcon,
  AccountCircle,
  Logout,
  Groups as GroupsIcon,
  PeopleAlt,
  Business,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/components/Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, canManageAll, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
    handleMobileMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const menuItems = [
    { text: 'Meine Gruppen', icon: <DashboardIcon />, path: '/dashboard', show: true },
    { text: 'Alle Gruppen', icon: <GroupsIcon />, path: '/all-groups', show: canManageAll() },
    { text: 'Benutzer', icon: <PeopleAlt />, path: '/admin/users', show: isAdmin() },
    { text: 'Einheiten', icon: <Business />, path: '/admin/units', show: isAdmin() },
  ];

  return (
    <AppBar position="sticky" className="navbar">
      <Toolbar>
        <Box className="navbar-brand" onClick={() => handleNavigation('/dashboard')} sx={{ cursor: 'pointer' }}>
          <LocalFireDepartment className="brand-icon" />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="h6" className="brand-title">
              Leistungsspange 2026
            </Typography>
            <Typography variant="caption" className="brand-subtitle">
              Bedburg Feuerwehr
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Typography variant="h6" className="brand-title" sx={{ fontSize: '1rem' }}>
              LS 2026
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {isMobile ? (
          <>
            <IconButton
              size="large"
              onClick={handleMobileMenuToggle}
              color="inherit"
              edge="end"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={mobileMenuOpen}
              onClose={handleMobileMenuClose}
              slotProps={{
                paper: { sx: { width: 280 } }
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Avatar sx={{ width: 60, height: 60, margin: '0 auto', mb: 1, bgcolor: 'primary.main' }}>
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user?.email}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {menuItems.filter(item => item.show).map((item) => (
                    <ListItem
                      button
                      key={item.text}
                      onClick={() => handleNavigation(item.path)}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <ListItem
                    button
                    onClick={() => handleNavigation('/profile')}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemIcon><AccountCircle /></ListItemIcon>
                    <ListItemText primary="Profil" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={handleLogout}
                    sx={{ borderRadius: 1, color: 'error.main' }}
                  >
                    <ListItemIcon><Logout color="error" /></ListItemIcon>
                    <ListItemText primary="Abmelden" />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box className="navbar-menu">
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              className="nav-button"
            >
              Meine Gruppen
            </Button>

            {canManageAll() && (
              <Button
                color="inherit"
                startIcon={<GroupsIcon />}
                onClick={() => navigate('/all-groups')}
                className="nav-button"
              >
                Alle Gruppen
              </Button>
            )}

            {isAdmin() && (
              <>
                <Button
                  color="inherit"
                  startIcon={<PeopleAlt />}
                  onClick={() => navigate('/admin/users')}
                  className="nav-button"
                >
                  Benutzer
                </Button>
                <Button
                  color="inherit"
                  startIcon={<Business />}
                  onClick={() => navigate('/admin/units')}
                  className="nav-button"
                >
                  Einheiten
                </Button>
              </>
            )}

            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
              className="user-button"
            >
              <Avatar className="user-avatar">
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              className="user-menu"
            >
              <Box className="menu-header">
                <Typography variant="subtitle1" fontWeight={600}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                <AccountCircle fontSize="small" style={{ marginRight: 8 }} />
                Profil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" style={{ marginRight: 8 }} />
                Abmelden
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
