// src/components/dashboard/PWDMemberDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  Campaign,
  Support,
  Person,
  CheckCircle,
  Schedule,
  Warning,
  Phone,
  Email,
  AccessTime,
  ErrorOutline,
  Menu
} from '@mui/icons-material';
import PWDMemberSidebar from '../shared/PWDMemberSidebar';
import { useAuth } from '../../contexts/AuthContext';
import announcementService from '../../services/announcementService';
import { api } from '../../services/api';

function PWDMemberDashboard() {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [announcements, setAnnouncements] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user's barangay from currentUser
        const userBarangay = currentUser?.barangay || currentUser?.pwd_member?.barangay;
        console.log('Dashboard - Current User:', currentUser);
        console.log('Dashboard - User Barangay:', userBarangay);
        
        // Use announcementService to get filtered announcements
        const filteredAnnouncements = await announcementService.getFilteredForPWDMember(userBarangay);
        
        // Fetch support tickets for this user
        const ticketsResponse = await api.get('/support-tickets');
        const ticketsData = ticketsResponse || [];
        const userTickets = ticketsData.filter(ticket => 
          ticket.pwd_member?.user?.id === currentUser?.id
        );
        
        setAnnouncements(filteredAnnouncements.slice(0, 3));
        setSupportTickets(userTickets);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: '#F8F9FA',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    }}>
      <PWDMemberSidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />
      
      {/* Main content */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        ml: { xs: 0, md: '280px' },
        width: { xs: '100%', md: 'calc(100% - 280px)' },
        p: { xs: 1, sm: 2, md: 3 },
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        {/* Mobile Menu Button */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          alignItems: 'center', 
          mb: 2,
          p: 1
        }}>
          <IconButton
            onClick={handleSidebarToggle}
            sx={{
              color: '#566573',
              border: '1px solid #D5DBDB',
              borderRadius: 2,
              '&:hover': {
                borderColor: '#253D90',
                background: '#F4F7FC',
                color: '#253D90'
              }
            }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, color: '#000000', fontWeight: 600 }}>
            PWD Dashboard
          </Typography>
        </Box>

        {/* Header */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            color: '#000000', 
            mb: 1,
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
          }}>
            Welcome to Your PWD Dashboard
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#000000',
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
          }}>
            Access announcements, support services, and manage your PWD benefits.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} icon={<ErrorOutline />}>
            {error}
          </Alert>
        )}

        {/* Main Content Grid */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
          {/* Latest Announcements */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{
              p: 3,
              border: '1px solid #E0E0E0',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
              height: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Campaign sx={{ color: '#F39C12', fontSize: 24 }} />
                <Typography sx={{ fontWeight: 700, color: '#000000', fontSize: '1.2rem' }}>
                  Latest Announcements
                </Typography>
              </Box>
              
              {announcements.length > 0 ? (
                <List>
                  {announcements.map((announcement, index) => (
                    <React.Fragment key={announcement.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Campaign sx={{ color: '#F39C12', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#000000' }}>
                                {announcement.title}
                              </Typography>
                              {/* Show barangay-specific badge */}
                              {announcement.targetAudience !== 'All' && 
                               announcement.targetAudience !== 'PWD Members' && 
                               announcement.targetAudience !== 'PWDMember' && (
                                <Box
                                  sx={{
                                    backgroundColor: '#3498DB',
                                    color: 'white',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    fontSize: '0.6rem',
                                    fontWeight: 600
                                  }}
                                >
                                  {announcement.targetAudience}
                                </Box>
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: '#000000' }}>
                              {new Date(announcement.created_at).toLocaleDateString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < announcements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ErrorOutline sx={{ fontSize: 48, color: '#000000', mb: 2 }} />
                  <Typography variant="body1" sx={{ color: '#000000', mb: 1 }}>
                    No announcements at the moment
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000000' }}>
                    Check back later for important updates
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Support Desk */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{
              p: 3,
              border: '1px solid #E0E0E0',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
              height: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Support sx={{ color: '#E74C3C', fontSize: 24 }} />
                <Typography sx={{ fontWeight: 700, color: '#000000', fontSize: '1.2rem' }}>
                  Support Desk
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: '#000000', mb: 3 }}>
                Need help? Our support team is here to assist you with any questions or concerns.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  sx={{ 
                    bgcolor: '#E74C3C', 
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    '&:hover': { bgcolor: '#C0392B' }
                  }}
                >
                  Create Support Ticket
                </Button>
                <Button
                  variant="outlined"
                  sx={{ 
                    borderColor: '#E74C3C', 
                    color: '#E74C3C',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    '&:hover': { borderColor: '#C0392B', backgroundColor: '#E74C3C15' }
                  }}
                >
                  View My Tickets
                </Button>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Phone sx={{ color: '#E74C3C', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: '#000000' }}>
                    Phone: (049) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Email sx={{ color: '#E74C3C', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: '#000000' }}>
                    Email: support@pdao.cabuyao.gov.ph
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ color: '#E74C3C', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: '#000000' }}>
                    Hours: Mon-Fri, 8AM-5PM
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
              bgcolor: '#FFFFFF', 
              border: '1px solid #E0E0E0',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: '#27AE60', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#27AE60' }}>
                  Approved
                </Typography>
                <Typography variant="body2" sx={{ color: '#000000' }}>
                  Application Status
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
              bgcolor: '#FFFFFF', 
              border: '1px solid #E0E0E0',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Person sx={{ fontSize: 40, color: '#3498DB', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3498DB' }}>
                  PWD
                </Typography>
                <Typography variant="body2" sx={{ color: '#000000' }}>
                  Member Since
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
              bgcolor: '#FFFFFF', 
              border: '1px solid #E0E0E0',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Campaign sx={{ fontSize: 40, color: '#F39C12', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F39C12' }}>
                  {announcements.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#000000' }}>
                  Announcements
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
              bgcolor: '#FFFFFF', 
              border: '1px solid #E0E0E0',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Support sx={{ fontSize: 40, color: '#E74C3C', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E74C3C' }}>
                  {supportTickets.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#000000' }}>
                  Support Tickets
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default PWDMemberDashboard;