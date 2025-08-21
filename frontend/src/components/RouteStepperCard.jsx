import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  useTheme,
} from '@mui/material';
import { 
  MapPin, 
  Star, 
  Clock, 
  Play, 
  Flag,
  Navigation
} from 'lucide-react';
import { CATEGORY_ICONS } from '../utils/constants';

// Improved helper function to get icon for category
const getCategoryIcon = (category) => {
  if (!category) {
    console.log('⚠️ No category provided, using MapPin');
    return MapPin;
  }
  
  console.log('🔍 Original category:', category);
  
  // Clean and normalize the category string
  const categoryLower = category
    .toLowerCase()
    .replace(/\s+/g, '') // Remove all spaces
    .replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
  
  console.log('🔍 Cleaned category:', categoryLower);
  
  // Direct match first
  if (CATEGORY_ICONS[categoryLower]) {
    console.log('✅ Direct match found:', categoryLower);
    return CATEGORY_ICONS[categoryLower];
  }
  
  // Try common variations and partial matches
  const categoryChecks = [
    // Pharmacy variations
    { keywords: ['pharmacy', 'medical', 'drug', 'chemist', 'medicine'], icon: 'pharmacy' },
    
    // Gas station variations  
    { keywords: ['gas', 'fuel', 'petrol', 'station'], icon: 'gas' },
    
    // Grocery variations
    { keywords: ['grocery', 'supermarket', 'food', 'market', 'indian'], icon: 'grocery' },
    
    // Coffee variations
    { keywords: ['coffee', 'cafe', 'snack'], icon: 'coffee' },
    
    // Restaurant variations
    { keywords: ['restaurant', 'dining', 'eat'], icon: 'restaurant' },
    
    // Shopping variations
    { keywords: ['shop', 'store', 'retail', 'mall'], icon: 'store' },
    
    // Bank variations
    { keywords: ['bank', 'atm', 'financial'], icon: 'bank' },
    
    // Fitness variations
    { keywords: ['gym', 'fitness', 'workout', 'sport'], icon: 'gym' },
    
    // Personal care variations
    { keywords: ['laundry', 'salon', 'barber', 'spa'], icon: 'laundry' },
  ];
  
  // Check for partial matches
  for (const check of categoryChecks) {
    if (check.keywords.some(keyword => categoryLower.includes(keyword))) {
      console.log(`✅ Partial match found: ${check.icon} for category: ${categoryLower}`);
      return CATEGORY_ICONS[check.icon] || MapPin;
    }
  }
  
  console.log('⚠️ No match found for:', categoryLower, '- using MapPin');
  return MapPin;
};

// Custom Step Content Component
const CustomStepContent = ({ step, theme }) => {
  return (
    <Box sx={{ flex: 1, pb: 2 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1, mt: 0.5 }}>
        {step.name}
      </Typography>
      
      {step.isStart && (
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {step.description}
          </Typography>
          <Chip 
            label="🚀 Let's Go!" 
            color="success" 
            size="small"
            sx={{ alignSelf: 'flex-start' }}
          />
        </Stack>
      )}
      
      {step.isEnd && (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {step.description}
          </Typography>
          <Chip 
            label="🎊 Well Done!" 
            color="success" 
            sx={{ alignSelf: 'flex-start' }}
          />
        </Stack>
      )}
      
      {!step.isStart && !step.isEnd && (
        <Stack spacing={2}>
          <Chip 
            label={step.category} 
            size="small" 
            sx={{ 
              alignSelf: 'flex-start',
              bgcolor: theme.palette.primary.main + '20',
              color: theme.palette.primary.main,
              fontWeight: 500,
            }} 
          />
          
          <Stack direction="row" alignItems="center" color="text.secondary" spacing={1}>
            <MapPin size={14} />
            <Typography variant="body2">
              {step.address}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={3} alignItems="center">
            {step.rating && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Star size={14} fill="orange" color="orange" />
                <Typography variant="body2" fontWeight={500}>
                  {step.rating.toFixed(1)}
                </Typography>
              </Stack>
            )}
            {step.eta && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Clock size={14} />
                <Typography variant="body2">
                  {step.eta}
                </Typography>
              </Stack>
            )}
          </Stack>
          
          <Button
            href={step.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="small"
            startIcon={<Navigation size={14} />}
            sx={{ 
              alignSelf: 'flex-start',
              px: 2,
              py: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Navigate Here
          </Button>
        </Stack>
      )}
    </Box>
  );
};

const RouteStepperCard = ({ plan }) => {
  const theme = useTheme();
  
  if (!plan || !plan.stops) return null;

  console.log('🎯 RouteStepperCard - Plan data:', plan);
  console.log('🎯 RouteStepperCard - Stops:', plan.stops);

  // Create steps array with start and end
  const steps = [
    {
      id: 'start',
      name: 'Journey Begins',
      category: 'start',
      description: 'Starting your optimized route adventure!',
      isStart: true,
    },
    ...plan.stops.map((stop, index) => {
      console.log(`🎯 Processing stop ${index + 1}:`, stop);
      return {
        ...stop,
        stepNumber: index + 1,
        isStop: true, // Add this flag to identify regular stops
      };
    }),
    {
      id: 'end',
      name: 'Journey Complete! 🎉',
      category: 'end',
      description: 'You\'ve successfully completed all your errands',
      isEnd: true,
    },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%',
      px: 2,
    }}>
      <Paper elevation={0} sx={{ 
        p: 4, 
        width: '100%', 
        maxWidth: '700px',
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
      }}>
        <Stack spacing={4}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h2" fontWeight={700}>
              Your Route Journey
            </Typography>
            <Chip 
              label={`${plan.stops.length} stops`} 
              color="primary" 
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          {/* Total Time */}
          {plan.total_time && (
            <Stack direction="row" alignItems="center" color="text.secondary">
              <Clock size={16} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Estimated total time: {plan.total_time}
              </Typography>
            </Stack>
          )}

          {/* Custom Stepper */}
          <Box sx={{ pl: 2 }}>
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              
              return (
                <Box key={step.id} sx={{ 
                  position: 'relative', 
                  display: 'flex',
                  minHeight: isLast ? 'auto' : '140px'
                }}>
                  {/* Icon Column */}
                  <Box sx={{ 
                    position: 'relative', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    mr: 3,
                    width: 48,
                    flexShrink: 0
                  }}>
                    {/* Step Icon */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: (() => {
                          if (step.isStart) {
                            return `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`;
                          }
                          if (step.isEnd) {
                            return `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`;
                          }
                          return `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
                        })(),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: (() => {
                          if (step.isStart) return `0 4px 12px ${theme.palette.success.main}40`;
                          if (step.isEnd) return `0 4px 12px ${theme.palette.error.main}40`;
                          return `0 4px 12px ${theme.palette.primary.main}40`;
                        })(),
                        zIndex: 3,
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      {(() => {
                        // For start icon
                        if (step.isStart) {
                          return <Play size={22} fill="white" />;
                        }
                        
                        // For end icon
                        if (step.isEnd) {
                          return <Flag size={22} fill="white" />;
                        }
                        
                        // For regular stops - show category icons instead of numbers
                        if (step.isStop) {
                          console.log('🎨 Rendering icon for step:', step.name, 'category:', step.category);
                          const IconComponent = getCategoryIcon(step.category);
                          console.log('🎨 Selected icon component:', IconComponent.name || IconComponent.displayName || 'Unknown');
                          return <IconComponent size={22} color="white" />;
                        }
                        
                        // Fallback to MapPin
                        return <MapPin size={22} color="white" />;
                      })()}
                    </Box>
                    
                    {/* Step Number Badge (small overlay) */}
                    {step.isStop && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: theme.palette.background.paper,
                          border: `2px solid ${theme.palette.primary.main}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 4,
                        }}
                      >
                        <Typography variant="caption" fontSize="0.7rem" fontWeight={700} color="primary">
                          {step.stepNumber}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Connecting Line */}
                    {!isLast && (
                      <Box
                        sx={{
                          width: 3,
                          flexGrow: 1,
                          minHeight: '92px',
                          backgroundColor: step.isStart 
                            ? theme.palette.success.main
                            : theme.palette.primary.main,
                          mt: 1,
                          borderRadius: '1.5px'
                        }}
                      />
                    )}
                  </Box>

                  {/* Content */}
                  <CustomStepContent step={step} theme={theme} />
                </Box>
              );
            })}
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RouteStepperCard;