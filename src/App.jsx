import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './assets/styles/theme';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import ViewGroup from './pages/ViewGroup';
import AllGroups from './pages/AllGroups';
import ManageUsers from './pages/ManageUsers';
import ManageUnits from './pages/ManageUnits';
import Profile from './pages/Profile';
import GitHubCallback from './pages/GitHubCallback';
import OAuth2Callback from './pages/OAuth2Callback';
import './assets/styles/global.scss';
import Footer from "./components/Footer";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/auth/github/callback" element={<GitHubCallback />} />
                <Route path="/oauth2/callback" element={<OAuth2Callback />} />

                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Navbar />
                      <Dashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/all-groups"
                  element={
                    <PrivateRoute>
                      <Navbar />
                      <AllGroups />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <PrivateRoute>
                      <Navbar />
                      <ManageUsers />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/units"
                  element={
                    <PrivateRoute>
                      <Navbar />
                      <ManageUnits />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Navbar />
                      <Profile />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/groups/create"
                  element={
                    <PrivateRoute>
                      <Navbar />
                      <CreateGroup />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/groups/:id"
                  element={
                    <PrivateRoute>
                      <Navbar />
                      <ViewGroup />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/groups/edit/:id"
                  element={
                    <PrivateRoute>
                      <Navbar />
                      <CreateGroup />
                    </PrivateRoute>
                  }
                />

                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
