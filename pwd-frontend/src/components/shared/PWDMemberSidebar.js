import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function PWDMemberSidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarContent = (
    <Box sx={{
      width: 280,
      height: '100%',
      bgcolor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      borderRight: '1px solid #E0E0E0'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderBottom: '1px solid #E0E0E0',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          bgcolor: '#E0E0E0',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          PDAO
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ color: '#000000', fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            CABUYAO PDAO RMS
          </Typography>
          <Typography variant="body2" sx={{ color: '#000000', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
            PWD Member Portal
          </Typography>
        </Box>
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: '#000000', p: 0.5 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: '1px solid #E0E0E0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 32,
            height: 32,
            bgcolor: '#E0E0E0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            fontSize: '0.9rem'
          }}>
            <PersonIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="body2" sx={{ color: '#000000', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
            Hello PWD Member
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                sx={{
                  borderRadius: 1,
                  py: { xs: 1, sm: 1.5 },
                  px: 2,
                  bgcolor: location.pathname === item.path ? '#34495E' : 'transparent',
                  '&:hover': {
                    bgcolor: '#F5F5F5',
                  },
                  minHeight: { xs: 48, sm: 56 }
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? '#2E86C1' : '#BDC3C7',
                  minWidth: { xs: 40, sm: 48 }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: location.pathname === item.path ? 'white' : '#BDC3C7',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: location.pathname === item.path ? 600 : 400
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Section */}
      <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0' }}>
        <Divider sx={{ mb: 2, bgcolor: '#F5F5F5' }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            py: { xs: 1, sm: 1.5 },
            px: 2,
            bgcolor: '#F5F5F5',
            '&:hover': {
              bgcolor: '#FF6B6B',
            },
            minHeight: { xs: 48, sm: 56 }
          }}
        >
          <ListItemIcon sx={{ color: '#FF6B6B', minWidth: { xs: 40, sm: 48 } }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            sx={{
              '& .MuiListItemText-primary': {
                color: '#FF6B6B',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500
              }
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  return (
    <Box sx={{
      width: 280,
      height: '100vh',
      bgcolor: '#FFFFFF',
      position: 'fixed',
      left: 0,
      top: 0,
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {sidebarContent}
    </Box>
  );
}

export default PWDMemberSidebar;