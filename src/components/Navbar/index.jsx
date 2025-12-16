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
} from '@mui/material';
import {
  LocalFireDepartment,
  Dashboard as DashboardIcon,
  Add,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/components/Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar position="sticky" className="navbar">
      <Toolbar>
        <Box className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <LocalFireDepartment className="brand-icon" />
          <Box>
            <Typography variant="h6" className="brand-title">
              Leistungsspange 2026
            </Typography>
            <Typography variant="caption" className="brand-subtitle">
              Bedburg Feuerwehr
            </Typography>
          </Box>
        </Box>

        <Box className="navbar-menu">
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            className="nav-button"
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => navigate('/groups/create')}
            className="nav-button"
          >
            Neue Gruppe
          </Button>

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
            <MenuItem onClick={handleClose}>
              <AccountCircle fontSize="small" style={{ marginRight: 8 }} />
              Profil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" style={{ marginRight: 8 }} />
              Abmelden
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
