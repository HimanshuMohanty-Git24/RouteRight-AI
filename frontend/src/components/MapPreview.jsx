import React from 'react';
import { Box, Typography, Stack, Button, Paper } from '@mui/material';
import { TbMap2, TbExternalLink } from 'react-icons/tb';

const MapPreview = ({ plan }) => {
  if (!plan || !plan.map_preview_url) {
    return (
      <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <Typography color="text.secondary">Map preview is unavailable for this plan.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: '600px' }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6">Route Preview</Typography>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: '100%',
            height: '200px',
            bgcolor: 'grey.100',
            borderRadius: 1,
            textAlign: 'center',
            p: 2,
          }}
        >
          <TbMap2 size={48} color="#1976d2" />
          <Typography variant="body1" fontWeight="medium" mt={2}>
            Your route with {plan.stops.length} stops is ready.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click below to open the route in Google Maps.
          </Typography>
        </Stack>
        <Button
          href={plan.map_preview_url}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          fullWidth
          startIcon={<TbExternalLink />}
        >
          View Full Route Map
        </Button>
      </Stack>
    </Paper>
  );
};

export default MapPreview;