import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#6366f1' : '#818cf8',
      light: mode === 'light' ? '#a5b4fc' : '#c7d2fe',
      dark: mode === 'light' ? '#4f46e5' : '#6366f1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#06b6d4' : '#22d3ee',
      light: mode === 'light' ? '#67e8f9' : '#7dd3fc',
      dark: mode === 'light' ? '#0891b2' : '#0284c7',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
      gradient: mode === 'light' 
        ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' 
        : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    },
    text: {
      primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    divider: mode === 'light' ? '#e2e8f0' : '#334155',
    success: {
      main: mode === 'light' ? '#10b981' : '#34d399',
      light: mode === 'light' ? '#6ee7b7' : '#86efac',
      dark: mode === 'light' ? '#059669' : '#10b981',
    },
    warning: {
      main: mode === 'light' ? '#f59e0b' : '#fbbf24',
      light: mode === 'light' ? '#fcd34d' : '#fed7aa',
    },
    error: {
      main: mode === 'light' ? '#ef4444' : '#f87171',
    },
    info: {
      main: mode === 'light' ? '#3b82f6' : '#60a5fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: 16,
          backdropFilter: 'blur(20px)',
          border: theme.palette.mode === 'light' 
            ? '1px solid rgba(226, 232, 240, 0.8)' 
            : '1px solid rgba(51, 65, 85, 0.8)',
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(30, 41, 59, 0.9)',
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default getTheme;