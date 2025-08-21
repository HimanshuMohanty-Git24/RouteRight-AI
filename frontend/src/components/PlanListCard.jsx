import React from 'react';
import { Box, Stack, Typography, Chip, Button, Divider, Paper, useTheme } from '@mui/material';
import { TbMapPin, TbStar, TbClock, TbExternalLink } from 'react-icons/tb';
import { CATEGORY_ICONS } from '../utils/constants';

const PlanListCard = ({ plan }) => {
  const theme = useTheme();
  if (!plan || !plan.stops) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: '600px' }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2" fontWeight="bold">
            Your Errand Plan
          </Typography>
          <Chip label={`${plan.stops.length} stops`} color="success" />
        </Stack>

        {plan.total_time && (
          <Stack direction="row" alignItems="center" color="text.secondary">
            <TbClock size={16} />
            <Typography variant="body2">
              Estimated total time: {plan.total_time}
            </Typography>
          </Stack>
        )}

        <Divider />

        <Stack spacing={2}>
          {plan.stops.map((stop, index) => (
            <Box key={stop.id} sx={{ p: 2, bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.900', borderRadius: 1 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Typography variant="h5" sx={{ mt: 0.5 }}>
                  {CATEGORY_ICONS[stop.category.toLowerCase().split(' ')[0]] || CATEGORY_ICONS.default}
                </Typography>
                <Stack flexGrow={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={index + 1} color="primary" size="small" sx={{ height: 20, fontSize: '0.75rem' }} />
                    <Typography fontWeight="bold">{stop.name}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{stop.category}</Typography>
                  <Stack direction="row" alignItems="center" color="text.secondary" spacing={0.5}>
                    <TbMapPin size={14} />
                    <Typography variant="caption" noWrap>{stop.address}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
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
                <Button
                  href={stop.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  variant="outlined"
                  startIcon={<TbExternalLink />}
                >
                  Navigate
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PlanListCard;