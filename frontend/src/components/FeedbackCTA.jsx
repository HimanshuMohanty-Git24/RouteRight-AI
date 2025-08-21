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
  useTheme,
  Fade,
} from '@mui/material';
import { RefreshCw, Heart } from 'lucide-react';
import { planAPI } from '../services/api';

const FeedbackCTA = ({ plan, onNewPlan }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const theme = useTheme();

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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%',
        px: 2,
      }}>
        <Fade in timeout={500}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              maxWidth: 400,
              width: '100%',
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Stack spacing={3} alignItems="center">
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.success.main}20, ${theme.palette.success.light}20)`,
                  border: `2px solid ${theme.palette.success.main}30`,
                }}
              >
                <Heart size={32} color={theme.palette.success.main} />
              </Box>
              
              <Typography variant="h6" fontWeight={600}>
                Thank you for your feedback!
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Your input helps us improve our route planning.
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<RefreshCw size={18} />}
                onClick={onNewPlan}
                size="large"
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  },
                }}
              >
                Plan Another Route
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Box>
    );
  }

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
          p: 4, 
          maxWidth: 400, 
          width: '100%',
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h6" textAlign="center" fontWeight={600}>
            How was your experience?
          </Typography>
          
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Rate your overall experience
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: theme.palette.warning.main,
                },
                '& .MuiRating-iconHover': {
                  color: theme.palette.warning.light,
                },
              }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <Divider />

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<RefreshCw size={18} />}
              onClick={onNewPlan}
              disabled={isSubmitting}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}08`,
                },
              }}
            >
              Plan Another Route
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              sx={{
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                },
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default FeedbackCTA;