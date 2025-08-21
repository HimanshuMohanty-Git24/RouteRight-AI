import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Stack,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import { TbRefresh, TbHeart } from 'react-icons/tb';
import { planAPI } from '../services/api';

const FeedbackCTA = ({ plan, onNewPlan }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async () => {
    console.log('📤 FEEDBACK: Submitting feedback');
    console.log('📤 FEEDBACK: Plan ID:', plan?.plan_id);
    console.log('📤 FEEDBACK: Rating:', rating);
    console.log('📤 FEEDBACK: Comments:', comments);
    
    if (rating === 0) {
      alert('Please provide a rating before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format feedback data to match backend FeedbackRequest model
      const feedbackData = {
        plan_id: plan.plan_id,
        overall_rating: rating,
        stops_feedback: plan.stops?.map(stop => ({
          stop_id: stop.id,
          rating: rating, // Use overall rating for each stop
          visited: true,
          issues: null
        })) || [],
        comments: comments || null,
        created_at: new Date().toISOString()
      };
      
      console.log('📤 FEEDBACK: Sending data:', feedbackData);
      
      await planAPI.submitFeedback(plan.plan_id, feedbackData);
      
      console.log('✅ FEEDBACK: Submitted successfully');
      setShowThankYou(true);
      // Remove the setTimeout - keep the thank you message permanently
    } catch (error) {
      console.error('❌ FEEDBACK: Submission error:', error);
      console.error('❌ FEEDBACK: Error response:', error.response?.data);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showThankYou) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        <TbHeart size={48} color="#4CAF50" />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Thank you for your feedback!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your input helps us improve our route planning.
        </Typography>
        <Button
          variant="contained"
          startIcon={<TbRefresh />}
          onClick={onNewPlan}
          size="large"
          sx={{ mt: 1 }}
        >
          Plan Another Route
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 400, width: '100%' }}>
      <Stack spacing={3}>
        <Typography variant="h6" textAlign="center">
          How was your experience?
        </Typography>
        
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Rate your overall experience
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />
        </Box>

        <TextField
          label="Comments (optional)"
          multiline
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Tell us what worked well or could be improved..."
          variant="outlined"
          fullWidth
        />

        <Divider />

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<TbRefresh />}
            onClick={onNewPlan}
            disabled={isSubmitting}
          >
            Plan Another Route
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FeedbackCTA;