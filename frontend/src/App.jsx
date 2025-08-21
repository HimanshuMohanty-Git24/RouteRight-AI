import React, { useState, useEffect } from 'react';
import { Container, Stack, Box, Alert, Typography } from '@mui/material';

import HeroInput from './components/HeroInput';
import ProgressCarousel from './components/ProgressCarousel';
import PlanListCard from './components/PlanListCard';
import MapPreview from './components/MapPreview';
import FeedbackCTA from './components/FeedbackCTA';

import usePlanStore from './stores/planStore';

function App() {
  const [currentView, setCurrentView] = useState('input');
  const {
    currentPlan,
    error,
    isLoading,
    generatePlan,
    reset,
  } = usePlanStore();

  // Debug logging for state changes
  console.log('🎯 APP: Current view:', currentView);
  console.log('🎯 APP: Current plan:', currentPlan);
  console.log('🎯 APP: Error:', error);
  console.log('🎯 APP: IsLoading:', isLoading);

  // Watch for plan completion and switch to results view
  useEffect(() => {
    console.log('🔄 APP: useEffect triggered - plan:', !!currentPlan, 'loading:', isLoading, 'view:', currentView);
    
    if (currentPlan && !isLoading && currentView === 'progress') {
      console.log('✅ APP: Plan completed, switching to results view');
      setCurrentView('results');
    }
    
    if (error && !isLoading && currentView === 'progress') {
      console.log('❌ APP: Error occurred, switching to input view');
      setCurrentView('input');
    }
  }, [currentPlan, isLoading, error, currentView]);

  const handlePlanSubmit = async (planData) => {
    console.log('🚀 APP: handlePlanSubmit called with:', planData);
    console.log('🔍 APP: planData type:', typeof planData);
    console.log('🔍 APP: planData keys:', planData ? Object.keys(planData) : 'null');
    console.log('🔍 APP: planData.text:', planData.text);
    console.log('🔍 APP: planData.user_text:', planData.user_text);
    
    // Reset store and set view to progress
    reset();
    setCurrentView('progress');
    
    console.log('📊 APP: State reset, view set to progress');
    
    try {
      // Convert frontend format to backend format - handle both possible field names
      const backendData = {
        user_text: planData.text || planData.user_text,  // Handle both field names
        lat: planData.lat,
        lng: planData.lng
      };
      
      console.log('🔄 APP: Converted data for backend:', backendData);
      console.log('🔄 APP: backendData.user_text:', backendData.user_text);
      console.log('📡 APP: Calling store.generatePlan');
      
      // Call the store's generatePlan method
      await generatePlan(backendData);
      
      console.log('✅ APP: generatePlan completed');
      
    } catch (err) {
      console.error('❌ APP: Error in handlePlanSubmit:', err);
      console.error('❌ APP: Error type:', typeof err);
      console.error('❌ APP: Error message:', err.message);
      setCurrentView('input');
    }
  };

  const handleNewPlan = () => {
    setCurrentView('input');
    reset();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">
          <Box textAlign="center">
            <Typography variant="h3" component="h1" color="primary" fontWeight="bold">
              RouteRight AI
            </Typography>
            <Typography color="text.secondary">
              Your smart errand planning co-pilot
            </Typography>
          </Box>

          {error && currentView === 'input' && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {currentView === 'input' && <HeroInput onSubmit={handlePlanSubmit} />}
          {currentView === 'progress' && <ProgressCarousel />}
          {currentView === 'results' && currentPlan && (
            <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
              <PlanListCard plan={currentPlan} />
              <MapPreview plan={currentPlan} />
              <FeedbackCTA plan={currentPlan} onNewPlan={handleNewPlan} />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default App;