import React from 'react';
import { Box, Stack, Typography, LinearProgress, Avatar, keyframes, Paper, useTheme } from '@mui/material';
import { Check, Loader2, Sparkles } from 'lucide-react';
import usePlanStore from '../stores/planStore';
import { STEPS, STEP_MESSAGES } from '../utils/constants';

// Create a smoother spinning animation
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Pulse animation for the main icon
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const ProgressCarousel = () => {
  const { isLoading, progress, currentStep } = usePlanStore();
  const theme = useTheme();
  
  const steps = Object.keys(STEPS);
  const currentStepIndex = steps.indexOf(currentStep);
  const displayProgress = progress > 0 ? progress : Math.min((currentStepIndex + 1) * 20, 100);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%',
      px: 2,
    }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, md: 4 }, 
          width: '100%', 
          maxWidth: '600px', 
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Stack spacing={4} alignItems="center">
          {/* Main Loading Section */}
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                border: `2px solid ${theme.palette.primary.main}30`,
                animation: `${pulse} 2s ease-in-out infinite`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {currentStep === 'complete' ? (
                <Sparkles size={40} color={theme.palette.success.main} />
              ) : (
                <Box 
                  sx={{ 
                    animation: `${spin} 2s linear infinite`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Loader2 size={40} color={theme.palette.primary.main} />
                </Box>
              )}
            </Box>
            
            <Stack spacing={1} alignItems="center">
              <Typography variant="h5" fontWeight={600} textAlign="center">
                {currentStep === 'complete' ? 'Route Ready!' : STEP_MESSAGES[currentStep] || 'Planning your route...'}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 400 }}>
                {currentStep === 'complete' 
                  ? 'Your optimized route has been created successfully!' 
                  : 'Our AI is working to create the perfect route for your errands...'
                }
              </Typography>
            </Stack>
          </Stack>

          {/* Progress Section */}
          <Box sx={{ width: '100%' }}>
            <LinearProgress 
              variant="determinate"
              value={displayProgress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                mb: 4,
                '& .MuiLinearProgress-bar': {
                  transition: 'transform 0.6s ease-in-out',
                  backgroundColor: currentStep === 'complete' ? theme.palette.success.main : theme.palette.primary.main,
                  borderRadius: 4,
                },
                backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
              }} 
            />

            {/* Steps Indicators */}
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" flexWrap="wrap">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex || currentStep === 'complete';
                const isActive = index === currentStepIndex && currentStep !== 'complete';
                
                return (
                  <Stack 
                    key={step} 
                    spacing={1.5} 
                    alignItems="center" 
                    sx={{ 
                      minWidth: 80,
                      flex: { xs: '1 1 80px', md: '0 0 auto' },
                    }}
                  >
                    <Avatar sx={{
                      bgcolor: isCompleted 
                        ? theme.palette.success.main 
                        : isActive 
                          ? theme.palette.primary.main 
                          : theme.palette.action.disabled,
                      width: 36,
                      height: 36,
                      fontSize: '0.9rem',
                      boxShadow: isActive ? `0 0 20px ${theme.palette.primary.main}40` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {isCompleted ? (
                        <Check size={18} />
                      ) : isActive ? (
                        <Box 
                          sx={{ 
                            animation: `${spin} 2s linear infinite`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 18,
                            height: 18,
                            transformOrigin: 'center center', // Ensure rotation happens from center
                          }}
                        >
                          <Loader2 
                            size={18} 
                            style={{
                              display: 'block',
                              margin: 0,
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography 
                          variant="caption" 
                          fontWeight="bold"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                          }}
                        >
                          {index + 1}
                        </Typography>
                      )}
                    </Avatar>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        lineHeight: 1.3,
                        fontWeight: isActive ? 600 : 400,
                        px: 1,
                      }}
                    >
                      {STEPS[step]}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProgressCarousel;