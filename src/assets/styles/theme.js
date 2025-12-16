import { createTheme } from '@mui/material/styles';

// Feuerwehr-Farben: Rot, Gelb, Schwarz, Weiß
export const theme = createTheme({
  palette: {
    primary: {
      main: '#C1272D', // Feuerwehr Rot
      light: '#E53935',
      dark: '#9A1F23',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFC107', // Feuerwehr Gelb/Gold
      light: '#FFD54F',
      dark: '#FFA000',
      contrastText: '#000000',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FFA726',
    },
    info: {
      main: '#1976D2',
    },
    success: {
      main: '#388E3C',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#C1272D',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#C1272D',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 4px 6px rgba(193, 39, 45, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 10px rgba(193, 39, 45, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
