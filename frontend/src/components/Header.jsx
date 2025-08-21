import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Stack,
  useTheme,
} from '@mui/material';
import { Sun, Moon, Github, Twitter } from 'lucide-react';
import { useThemeMode } from '../contexts/ThemeContext';

const Header = () => {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            component="img"
            src="/src/assets/logo.png"
            alt="RouteRight AI"
            sx={{ 
              height: 40, 
              width: 40,
              borderRadius: 1,
            }}
            onError={(e) => {
              // Fallback if logo doesn't load
              e.target.style.display = 'none';
            }}
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            RouteRight AI
          </Typography>
        </Stack>
        
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            href="https://github.com/HimanshuMohanty-Git24"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            <Github size={20} />
          </IconButton>
          <IconButton
            href="https://x.com/CodingHima"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            <Twitter size={20} />
          </IconButton>
          <IconButton 
            onClick={toggleMode} 
            size="small"
            sx={{ 
              color: theme.palette.text.secondary,
              ml: 1,
            }}
          >
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;