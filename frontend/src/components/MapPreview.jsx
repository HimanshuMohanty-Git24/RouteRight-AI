import React from 'react';
import { Box, Typography, Stack, Button, Paper, useTheme } from '@mui/material';
import { Map, ExternalLink } from 'lucide-react';

const MapPreview = ({ plan }) => {
  const theme = useTheme();

  if (!plan || !plan.map_preview_url) {
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
            p: 3, 
            width: '100%', 
            maxWidth: '600px', 
            textAlign: 'center',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
          }}
        >
          <Typography color="text.secondary">
            Map preview is unavailable for this plan.
          </Typography>
        </Paper>
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
          width: '100%', 
          maxWidth: '600px',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Route Map
          </Typography>
          
          <Box
            sx={{
              width: '100%',
              height: '180px',
              backgroundColor: theme.palette.mode === 'light' 
                ? 'rgba(248, 250, 252, 0.5)' 
                : 'rgba(51, 65, 85, 0.3)',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                border: `2px solid ${theme.palette.primary.main}30`,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Map size={28} color={theme.palette.primary.main} />
            </Box>
            
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Your route with {plan.stops.length} stops is ready
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Click below to open the route in Google Maps
            </Typography>
          </Box>
          
          <Button
            href={plan.map_preview_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            fullWidth
            size="large"
            startIcon={<ExternalLink size={18} />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              },
            }}
          >
            View Full Route Map
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MapPreview;