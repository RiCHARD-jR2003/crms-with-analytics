import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function PWDMemberSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/pwd-dashboard' },
    { text: 'Announcements', icon: <AnnouncementIcon />, path: '/pwd-announcements' },
    { text: 'Support Desk', icon: <SupportAgentIcon />, path: '/pwd-support' },
    { text: 'Profile', icon: <PersonIcon />, path: '/pwd-profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{
      width: 280,
      height: '100vh',
      bgcolor: '#2C3E50',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid #34495E',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          bgcolor: '#2E86C1',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          PDAO
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
            CABUYAO PDAO RMS
          </Typography>
          <Typography variant="body2" sx={{ color: '#BDC3C7', fontSize: '0.8rem' }}>
            PWD Member Portal
          </Typography>
        </Box>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid #34495E' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 32,
            height: 32,
            bgcolor: '#2E86C1',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.9rem'
          }}>
            <PersonIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="body2" sx={{ color: '#BDC3C7' }}>
            Hello PWD Member
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List sx={{ p: 0 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: location.pathname === item.path ? '#2E86C1' : 'transparent',
                  '&:hover': {
                    bgcolor: location.pathname === item.path ? '#2E86C1' : '#34495E'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? 'white' : '#BDC3C7',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: location.pathname === item.path ? 'white' : '#BDC3C7',
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      fontSize: '0.9rem'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid #34495E' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: '#E74C3C'
            }
          }}
        >
          <ListItemIcon sx={{ color: '#E74C3C', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Log Out"
            sx={{
              '& .MuiListItemText-primary': {
                color: '#E74C3C',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default PWDMemberSidebar;
