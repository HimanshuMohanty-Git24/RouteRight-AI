import React, { useState } from 'react';
import { Box, Stack, Typography, Button, Divider, Paper } from '@mui/material';
import { TbThumbUp, TbThumbDown, TbRefresh } from 'react-icons/tb';
import { planAPI } from '../services/api';

const FeedbackCTA = ({ plan, onNewPlan }) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (isPositive) => {
    setIsSubmitting(true);
    try {
      const feedbackData = plan.stops.map(stop => ({
        stop_id: stop.id,
        rating: isPositive ? 5 : 1,
        helpful: isPositive
      }));
      await planAPI.submitFeedback(plan.plan_id, feedbackData);
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error("Feedback submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: '600px' }}>
      <Stack spacing={2} alignItems="center">
        {!feedbackSubmitted ? (
          <>
            <Typography variant="h6">How did we do?</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                startIcon={<TbThumbUp />}
                color="success"
                variant="outlined"
                onClick={() => handleFeedback(true)}
                disabled={isSubmitting}
              >
                Helpful
              </Button>
              <Button
                startIcon={<TbThumbDown />}
                color="error"
                variant="outlined"
                onClick={() => handleFeedback(false)}
                disabled={isSubmitting}
              >
                Needs Work
              </Button>
            </Stack>
          </>
        ) : (
          <Typography color="success.main" fontWeight="medium">
            ✓ Feedback received, thank you!
          </Typography>
        )}
        
        <Divider sx={{ width: '100%' }} />
        
        <Button
          startIcon={<TbRefresh />}
          variant="contained"
          onClick={onNewPlan}
          fullWidth
        >
          Create a New Plan
        </Button>
      </Stack>
    </Paper>
  );
};

export default FeedbackCTA;