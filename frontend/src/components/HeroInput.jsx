import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  useTheme,
  Fade,
  Container,
} from '@mui/material';
import { MapPin, Sparkles, Navigation, ArrowRight } from 'lucide-react';
import usePlanStore from '../stores/planStore';
import { locationAPI } from '../services/api';

const HeroInput = ({ onSubmit }) => {
  const [userInput, setUserInput] = useState('');
  const [locationError, setLocationError] = useState('');
  const { isLoading, userLocation, setUserLocation } = usePlanStore();
  const theme = useTheme();

  const handleGetLocation = useCallback(async () => {
    try {
      setLocationError('');
      const location = await locationAPI.getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      setLocationError('Unable to get location. Please enable location services and try again.');
    }
  }, [setUserLocation]);

  useEffect(() => {
    if (!userLocation) {
      handleGetLocation();
    }
  }, [handleGetLocation, userLocation]);

  const handleSubmit = () => {
    if (!userInput.trim() || !userLocation) return;
    onSubmit({
      user_text: userInput,
      lat: userLocation.lat,
      lng: userLocation.lng,
    });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%',
      px: 2,
    }}>
      <Stack spacing={6} alignItems="center" sx={{ py: 8, width: '100%', maxWidth: 'md' }}>
        {/* Hero Section */}
        <Fade in timeout={1000}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                border: `2px solid ${theme.palette.primary.main}30`,
              }}
            >
              <Sparkles size={48} color={theme.palette.primary.main} />
            </Box>
            
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                textAlign: 'center',
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              RouteRight AI
            </Typography>
            
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 600,
                lineHeight: 1.4,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                px: 2,
              }}
            >
              Your intelligent errand planning companion. Tell us what you need to do, and we'll create the perfect optimized route.
            </Typography>
          </Stack>
        </Fade>

        {/* Input Section */}
        <Fade in timeout={1500}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              width: '100%', 
              maxWidth: '700px',
              background: theme.palette.background.paper,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Navigation size={20} color={theme.palette.primary.main} />
                  <Typography variant="h6" fontWeight={600}>
                    Plan Your Route
                  </Typography>
                </Stack>
                
                <TextField
                  placeholder="e.g., I need groceries, want to pick up a prescription, get gas, and find a good coffee shop..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme.palette.mode === 'light' 
                        ? 'rgba(248, 250, 252, 0.7)' 
                        : 'rgba(15, 23, 42, 0.7)',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Stack>

              {locationError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: theme.palette.error.main,
                    },
                  }}
                >
                  {locationError}
                </Alert>
              )}

              {userLocation ? (
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  bgcolor: theme.palette.success.main + '10',
                  border: `1px solid ${theme.palette.success.main}30`,
                }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'success.main' }}>
                    <MapPin size={16} />
                    <Typography variant="body2" fontWeight={500}>
                      Location detected
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <Button
                  startIcon={<MapPin size={18} />}
                  variant="outlined"
                  onClick={handleGetLocation}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    borderColor: theme.palette.divider,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: `${theme.palette.primary.main}08`,
                    },
                  }}
                >
                  Get My Location
                </Button>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={!userInput.trim() || !userLocation || isLoading}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    boxShadow: `0 12px 48px ${theme.palette.primary.main}60`,
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabledBackground,
                    boxShadow: 'none',
                  },
                }}
              >
                {isLoading ? 'Planning Your Route...' : 'Plan My Route'}
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Stack>
    </Box>
  );
};

export default HeroInput;