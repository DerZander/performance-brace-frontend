import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './assets/styles/theme';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import GitHubCallback from './pages/GitHubCallback';
import OAuth2Callback from './pages/OAuth2Callback';
import './assets/styles/global.scss';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
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
              path="/groups/create"
              element={
                <PrivateRoute>
                  <Navbar />
                  <CreateGroup />
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
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
