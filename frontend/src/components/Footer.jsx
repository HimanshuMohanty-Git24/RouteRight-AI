import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import { Heart, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2}>
            <Stack spacing={1}>
              <Typography variant="h6" component="div" fontWeight={700}>
                RouteRight AI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your smart errand planning co-pilot
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={2}>
              <Link
                href="https://github.com/HimanshuMohanty-Git24"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.primary.main },
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Github size={20} />
              </Link>
              <Link
                href="https://x.com/CodingHima"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.primary.main },
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Twitter size={20} />
              </Link>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={2} alignItems="center">
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Made with
              </Typography>
              <Heart size={16} style={{ color: theme.palette.error.main }} />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                using Foursquare API & LangChain
              </Typography>
            </Stack>
            
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Developed by{' '}
              <Link
                href="https://github.com/HimanshuMohanty-Git24"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Himanshu Mohanty
              </Link>
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              © 2025 RouteRight AI. All rights reserved.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;