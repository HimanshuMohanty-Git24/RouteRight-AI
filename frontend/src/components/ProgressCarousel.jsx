import React from 'react';
import { Box, Stack, Typography, LinearProgress, Avatar, keyframes } from '@mui/material';
import { TbCheck, TbLoader } from 'react-icons/tb';
import usePlanStore from '../stores/planStore';
import { STEPS, STEP_MESSAGES } from '../utils/constants';

// Create spinning animation
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ProgressCarousel = () => {
  const { isLoading, progress, currentStep } = usePlanStore();
  
  // Debug logging
  console.log('🎠 PROGRESS CAROUSEL: Rendering with state:');
  console.log('  - isLoading:', isLoading);
  console.log('  - progress:', progress);
  console.log('  - currentStep:', currentStep);

  const steps = Object.keys(STEPS);
  const currentStepIndex = steps.indexOf(currentStep);

  // Use progress value or calculate based on step if no progress
  const displayProgress = progress > 0 ? progress : 10;

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '600px', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h6" textAlign="center">
          {currentStep === 'complete' ? 'Plan ready! 🎉' : STEP_MESSAGES[currentStep] || 'Planning your route...'}
        </Typography>

        <LinearProgress 
          variant="determinate"
          value={displayProgress} 
          sx={{ 
            width: '100%', 
            height: 8, 
            borderRadius: 4,
            '& .MuiLinearProgress-bar': {
              transition: 'transform 0.4s ease-in-out',
              backgroundColor: currentStep === 'complete' ? 'success.main' : 'primary.main'
            },
            backgroundColor: currentStep === 'complete' ? 'success.light' : 'grey.300'
          }} 
        />

        <Stack direction="row" spacing={0.5} justifyContent="space-between" sx={{ width: '100%', px: 1 }}>
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            return (
              <Stack 
                key={step} 
                spacing={1} 
                alignItems="center" 
                sx={{ 
                  flex: 1,
                  minWidth: 0, // Allow text to shrink
                  maxWidth: '20%', // Limit width to prevent overlap
                }}
              >
                <Avatar sx={{
                  bgcolor: isCompleted ? 'success.main' : isActive ? 'primary.main' : 'grey.400',
                  width: 32,
                  height: 32,
                  fontSize: '0.9rem'
                }}>
                  {isCompleted ? (
                    <TbCheck size={16} />
                  ) : isActive ? (
                    <Box sx={{ animation: `${spin} 1s linear infinite` }}>
                      <TbLoader size={16} />
                    </Box>
                  ) : (
                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{index + 1}</span>
                  )}
                </Avatar>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isActive ? 'primary.main' : 'text.secondary', 
                    textAlign: 'center',
                    fontSize: '0.65rem',
                    lineHeight: 1.1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                >
                  {STEPS[step]}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
        
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {currentStep === 'complete' 
            ? 'Your optimized route is ready!' 
            : 'Please wait, this usually takes a few seconds...'
          }
        </Typography>
      </Stack>
    </Box>
  );
};

export default ProgressCarousel;