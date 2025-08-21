import React from 'react';
import { Box, Stack, Typography, Chip, Button, Divider, Paper, useTheme } from '@mui/material';
import { TbMapPin, TbStar, TbClock, TbExternalLink } from 'react-icons/tb';
import { CATEGORY_ICONS } from '../utils/constants';

const PlanListCard = ({ plan }) => {
  const theme = useTheme();
  if (!plan || !plan.stops) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: '700px', mx: 'auto' }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Your Errand Plan
          </Typography>
          <Chip label={`${plan.stops.length} stops`} color="success" />
        </Stack>

        {plan.total_time && (
          <Stack direction="row" alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
            <TbClock size={16} />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              Estimated total time: {plan.total_time}
            </Typography>
          </Stack>
        )}

        <Divider />

        <Stack spacing={2}>
          {plan.stops.map((stop, index) => (
            <Box key={stop.id} sx={{ p: 2, bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.900', borderRadius: 1 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Typography variant="h5" sx={{ mt: 0.5, minWidth: 32 }}>
                  {CATEGORY_ICONS[stop.category.toLowerCase().split(' ')[0]] || CATEGORY_ICONS.default}
                </Typography>
                <Stack flexGrow={1} spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={index + 1} color="primary" size="small" sx={{ height: 20, fontSize: '0.75rem', minWidth: 24 }} />
                    <Typography fontWeight="bold" sx={{ lineHeight: 1.2 }}>{stop.name}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.2 }}>{stop.category}</Typography>
                  <Stack direction="row" alignItems="center" color="text.secondary" spacing={0.5} sx={{ mb: 1 }}>
                    <TbMapPin size={14} />
                    <Typography variant="caption" sx={{ lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {stop.address}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    {stop.rating && (
                      <Stack direction="row" alignItems="center" color="text.secondary" spacing={0.5}>
                        <TbStar size={14} color="orange" />
                        <Typography variant="caption">{stop.rating.toFixed(1)}</Typography>
                      </Stack>
                    )}
                    {stop.eta && (
                      <Stack direction="row" alignItems="center" color="text.secondary" spacing={0.5}>
                        <TbClock size={14} />
                        <Typography variant="caption">{stop.eta}</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 0.5 }}>
                  <Button
                    href={stop.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    variant="outlined"
                    startIcon={<TbExternalLink size={14} />}
                    sx={{ 
                      minWidth: 'auto',
                      px: 1.5,
                      py: 0.5,
                      fontSize: '0.75rem',
                      height: 32
                    }}
                  >
                    NAVIGATE
                  </Button>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PlanListCard;