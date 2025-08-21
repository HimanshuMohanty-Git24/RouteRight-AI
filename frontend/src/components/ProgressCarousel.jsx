import React from 'react';
import { Box, Stack, Typography, LinearProgress, Avatar } from '@mui/material';
import { TbCheck, TbLoader } from 'react-icons/tb';
import usePlanStore from '../stores/planStore';
import { STEPS, STEP_MESSAGES } from '../utils/constants';

const ProgressCarousel = () => {
  const { progress, currentStep } = usePlanStore();
  const steps = Object.keys(STEPS);
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '600px', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h6" textAlign="center">
          {STEP_MESSAGES[currentStep] || 'Planning your route...'}
        </Typography>

        <LinearProgress variant="determinate" value={progress} sx={{ width: '100%', height: 10, borderRadius: 5 }} />

        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            return (
              <Stack key={step} spacing={1} alignItems="center">
                <Avatar sx={{
                  bgcolor: isCompleted ? 'success.main' : isActive ? 'primary.main' : 'grey.400',
                  width: 40,
                  height: 40,
                }}>
                  {isCompleted ? <TbCheck /> : isActive ? <TbLoader className="animate-spin" /> : null}
                </Avatar>
                <Typography variant="caption" sx={{ color: isActive ? 'primary.main' : 'text.secondary', maxWidth: '60px', textAlign: 'center' }}>
                  {STEPS[step]}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Please wait, this usually takes a few seconds...
        </Typography>
      </Stack>
    </Box>
  );
};

export default ProgressCarousel;