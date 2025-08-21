import React from 'react';
import { Box, Stack, Typography, Chip, Button, Divider, Paper, useTheme } from '@mui/material';
import { MapPin, Star, Clock, ExternalLink } from 'lucide-react';
import { CATEGORY_ICONS } from '../utils/constants';

const PlanListCard = ({ plan }) => {
  const theme = useTheme();
  if (!plan || !plan.stops) return null;

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
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h5" component="h2" fontWeight={700}>
              Your Optimized Route
            </Typography>
            <Chip 
              label={`${plan.stops.length} stops`} 
              color="success" 
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          {plan.total_time && (
            <Stack direction="row" alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
              <Clock size={16} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Estimated total time: {plan.total_time}
              </Typography>
            </Stack>
          )}

          <Divider />

          <Stack spacing={3}>
            {plan.stops.map((stop, index) => {
              const IconComponent = CATEGORY_ICONS[stop.category.toLowerCase().split(' ')[0]] || CATEGORY_ICONS.default;
              
              return (
                <Paper 
                  key={stop.id} 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800', 
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: `0 4px 20px ${theme.palette.primary.main}15`,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    <Stack alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '50%',
                          bgcolor: theme.palette.primary.main + '20',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent size={20} color={theme.palette.primary.main} />
                      </Box>
                    </Stack>
                    
                    <Stack flexGrow={1} spacing={1}>
                      <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                        {stop.name}
                      </Typography>
                      
                      <Chip 
                        label={stop.category} 
                        size="small" 
                        sx={{ 
                          alignSelf: 'flex-start',
                          bgcolor: theme.palette.primary.main + '20',
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        }} 
                      />
                      
                      <Stack direction="row" alignItems="center" color="text.secondary" spacing={1} sx={{ mb: 1 }}>
                        <MapPin size={14} />
                        <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                          {stop.address}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 1 }}>
                        {stop.rating && (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Star size={14} fill="orange" color="orange" />
                            <Typography variant="body2" fontWeight={500}>
                              {stop.rating.toFixed(1)}
                            </Typography>
                          </Stack>
                        )}
                        {stop.eta && (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Clock size={14} />
                            <Typography variant="body2">
                              {stop.eta}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 0.5 }}>
                      <Button
                        href={stop.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="small"
                        startIcon={<ExternalLink size={14} />}
                        sx={{ 
                          minWidth: 'auto',
                          px: 2,
                          py: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        Navigate
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default PlanListCard;