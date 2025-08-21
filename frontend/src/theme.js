import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A standard blue color
    },
    secondary: {
      main: '#dc004e', // A standard pink color
    },
    background: {
      default: '#f5f5f5', // Light grey background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;