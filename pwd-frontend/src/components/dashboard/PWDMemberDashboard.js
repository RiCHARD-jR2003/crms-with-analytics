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
  Divider
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
  ErrorOutline
} from '@mui/icons-material';
import PWDMemberSidebar from '../shared/PWDMemberSidebar';
import { useAuth } from '../../contexts/AuthContext';
import announcementService from '../../services/announcementService';
import { api } from '../../services/api';

function PWDMemberDashboard() {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <PWDMemberSidebar />
      
      {/* Main content */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        ml: '280px',
        width: 'calc(100% - 280px)',
        p: 3
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#000000', mb: 1 }}>
            Welcome to Your PWD Dashboard
          </Typography>
          <Typography variant="h6" sx={{ color: '#000000' }}>
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
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Latest Announcements */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{
              p: 3,
              border: '1px solid #E0E0E0',
              borderRadius: 4,
              bgcolor: '#FFFFFF',
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Campaign sx={{ color: '#F39C12', fontSize: 24 }} />
                <Typography sx={{ fontWeight: 700, color: '#2C3E50', fontSize: '1.2rem' }}>
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
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#2C3E50' }}>
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
            <Paper elevation={0} sx={{
              p: 3,
              border: '1px solid #E0E0E0',
              borderRadius: 4,
              bgcolor: '#FFFFFF',
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Support sx={{ color: '#E74C3C', fontSize: 24 }} />
                <Typography sx={{ fontWeight: 700, color: '#2C3E50', fontSize: '1.2rem' }}>
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
            <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
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
            <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
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
            <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
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
            <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
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