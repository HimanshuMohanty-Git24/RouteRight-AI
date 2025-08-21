import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { TbMapPin, TbSparkles } from 'react-icons/tb';
import usePlanStore from '../stores/planStore';
import { locationAPI } from '../services/api';

const HeroInput = ({ onSubmit }) => {
  const [userInput, setUserInput] = useState('');
  const [locationError, setLocationError] = useState('');
  const { isLoading, userLocation, setUserLocation } = usePlanStore();

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
    <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '600px' }}>
      <Stack spacing={3} alignItems="center">
        <TbSparkles size={48} color="#1976d2" />
        <Typography variant="h5" component="h2" color="primary" fontWeight="bold">
          RouteRight AI
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          Tell me what you need to do, and I'll plan the perfect route.
        </Typography>

        <Stack spacing={2} sx={{ width: '100%' }}>
          <TextField
            placeholder="e.g., I need groceries, want to pick up a prescription, get gas, and find a good coffee shop..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />

          {locationError && <Alert severity="error">{locationError}</Alert>}

          {userLocation ? (
            <Typography variant="body2" color="green" textAlign="center">
              ✓ Location detected
            </Typography>
          ) : (
            <Button
              startIcon={<TbMapPin />}
              variant="outlined"
              onClick={handleGetLocation}
            >
              Get My Location
            </Button>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!userInput.trim() || !userLocation || isLoading}
          >
            {isLoading ? 'Planning...' : 'Plan My Route'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default HeroInput;