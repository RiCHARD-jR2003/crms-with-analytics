import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const MobileHeader = ({ onMenuToggle, isMenuOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();

  if (!isMobile) {
    return null; // Don't show on desktop
  }

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
          boxShadow: 2
        }}
      >
        <Toolbar sx={{ minHeight: '56px !important' }}>
          {/* Logo/Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                backgroundColor: '#FF6B35',
                mr: 1
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              PDAO Admin
            </Typography>
          </Box>

          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                mr: 1,
                fontSize: '0.8rem',
                opacity: 0.9
              }}
            >
              {currentUser?.username || 'Admin'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MobileHeader;
