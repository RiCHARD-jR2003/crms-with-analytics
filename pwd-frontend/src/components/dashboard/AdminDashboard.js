// src/components/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Announcement as AnnouncementIcon,
  Support as SupportIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  PersonAdd as PersonAddIcon,
  CreditCard as CreditCardIcon,
  Report as ReportIcon,
  Menu as MenuIcon,
  Campaign as CampaignIcon,
  History as HistoryIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../shared/AdminSidebar';
import dashboardService from '../../services/dashboardService';
import { 
  mainContainerStyles, 
  contentAreaStyles, 
  headerStyles, 
  titleStyles,
  subtitleStyles,
  cardStyles,
  dialogStyles,
  dialogTitleStyles,
  dialogContentStyles,
  dialogActionsStyles,
  buttonStyles,
  textFieldStyles,
  tableStyles,
  notificationBadgeStyles
} from '../../utils/themeStyles';

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPWDMembers: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    activeMembers: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [barangayContacts, setBarangayContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'person_add':
        return <PersonAddIcon sx={{ fontSize: 20 }} />;
      case 'campaign':
        return <CampaignIcon sx={{ fontSize: 20 }} />;
      case 'support':
        return <SupportIcon sx={{ fontSize: 20 }} />;
      case 'history':
        return <HistoryIcon sx={{ fontSize: 20 }} />;
      default:
        return <ScheduleIcon sx={{ fontSize: 20 }} />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Keep default values if API fails
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentActivities = async () => {
      try {
        setActivitiesLoading(true);
        const response = await dashboardService.getRecentActivities();
        setRecentActivities(response.data || []);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        setRecentActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };

    const fetchBarangayContacts = async () => {
      try {
        setContactsLoading(true);
        const response = await dashboardService.getBarangayContacts();
        setBarangayContacts(response.data || []);
      } catch (error) {
        console.error('Error fetching barangay contacts:', error);
        setBarangayContacts([]);
      } finally {
        setContactsLoading(false);
      }
    };

    fetchDashboardData();
    fetchRecentActivities();
    fetchBarangayContacts();
  }, []);

  const renderMapSection = () => (
    <Card sx={{ ...cardStyles, height: { xs: '250px', sm: '300px' }, mb: 3 }}>
      <CardContent sx={{ height: '100%', p: { xs: 1, sm: 2 } }}>
        <Box sx={{ 
          height: '100%', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1
        }}>
          {/* Map Background Pattern */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 40% 60%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: { xs: '30px 30px, 20px 20px, 25px 25px', sm: '40px 40px, 25px 25px, 30px 30px', md: '50px 50px, 30px 30px, 40px 40px' }
          }} />
          
          {/* Map Content */}
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold', 
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              textAlign: 'center'
            }}
          >
            MAP OF CABUYAO
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.9, 
              mb: { xs: 1.5, sm: 2, md: 3 },
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
            }}
          >
            Laguna, Philippines
          </Typography>
          
          {/* Barangay Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }, 
            gap: { xs: 0.5, sm: 0.75, md: 1 }, 
            maxWidth: { xs: '280px', sm: '400px', md: '600px' },
            width: '100%',
            px: { xs: 1, sm: 2 }
          }}>
            {[
              'Bigaa', 'Butong', 'Marinig', 'Gulod', 'Pob. Uno', 'Pob. Dos',
              'Pob. Tres', 'Sala', 'Niugan', 'Banaybanay', 'Pulo', 'Diezmo',
              'Pittland', 'San Isidro', 'Mamatid', 'Baclaran', 'Casile', 'Banlic'
            ].map((barangay, index) => (
              <Button
                key={barangay}
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: index % 3 === 0 ? '#3498DB' : index % 3 === 1 ? '#E74C3C' : '#27AE60',
                  fontSize: { xs: '8px', sm: '9px', md: '10px' },
                  py: { xs: 0.25, sm: 0.5 },
                  minWidth: { xs: '40px', sm: '50px', md: '60px' },
                  height: { xs: '24px', sm: '28px', md: '32px' },
                  '&:hover': {
                    backgroundColor: index % 3 === 0 ? '#2980B9' : index % 3 === 1 ? '#C0392B' : '#229954'
                  }
                }}
              >
                {barangay}
              </Button>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderLineChart = () => (
    <Card sx={{ ...cardStyles, height: { xs: '250px', sm: '300px' }, mb: 3 }}>
      <CardContent sx={{ height: '100%', p: { xs: 1, sm: 2 } }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#FFFFFF',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
            mb: { xs: 1, sm: 2 }
          }}
        >
          TOTAL NEWLY REGISTERED PWD MEMBERS (2025) - Line Chart
        </Typography>
        <Box sx={{ 
          height: { xs: '150px', sm: '180px', md: '200px' }, 
          display: 'flex', 
          alignItems: 'end', 
          justifyContent: 'space-between',
          px: { xs: 1, sm: 2 },
          border: '1px solid #E0E0E0',
          borderRadius: 1,
          background: 'linear-gradient(to top, #f8f9fa 0%, #ffffff 100%)',
          overflowX: 'auto'
        }}>
          {/* Chart bars representing months */}
          {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month, index) => (
            <Box key={month} sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: { xs: '20px', sm: '25px', md: '30px' }
            }}>
              <Box sx={{ 
                width: { xs: '12px', sm: '16px', md: '20px' }, 
                height: `${Math.random() * 80 + 20}px`, 
                backgroundColor: '#3498DB',
                borderRadius: '2px 2px 0 0',
                mb: { xs: 0.5, sm: 1 }
              }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '8px', sm: '9px', md: '10px' }, 
                  color: '#FFFFFF',
                  textAlign: 'center'
                }}
              >
                {month}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: { xs: 2, sm: 3 }, 
          mt: { xs: 1, sm: 2 },
          flexWrap: 'wrap'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: { xs: 8, sm: 10, md: 12 }, height: 2, backgroundColor: '#3498DB' }} />
            <Typography variant="caption" sx={{ color: '#FFFFFF', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              Registered
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: { xs: 8, sm: 10, md: 12 }, height: 2, backgroundColor: '#E74C3C' }} />
            <Typography variant="caption" sx={{ color: '#FFFFFF', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              Pending
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderOverview = () => (
    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
      {/* Summary Cards Row */}
      <Grid item xs={12}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card sx={{ ...cardStyles, height: { xs: '120px', sm: '140px', md: '160px' } }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: { xs: 1.5, sm: 2, md: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <CheckCircleIcon sx={{ 
                  fontSize: { xs: 24, sm: 32, md: 40 }, 
                  color: '#27AE60', 
                  mb: { xs: 0.5, sm: 1 } 
                }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#000000', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                  }}
                >
                  {stats.totalPWDMembers}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#000000', 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                    lineHeight: 1.2
                  }}
                >
                  Total Registered PWDs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2.4}>
            <Card sx={{ ...cardStyles, height: { xs: '120px', sm: '140px', md: '160px' } }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: { xs: 1.5, sm: 2, md: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <ScheduleIcon sx={{ 
                  fontSize: { xs: 24, sm: 32, md: 40 }, 
                  color: '#F39C12', 
                  mb: { xs: 0.5, sm: 1 } 
                }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#2C3E50', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                  }}
                >
                  {stats.pendingApplications}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#000000', 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                    lineHeight: 1.2
                  }}
                >
                  Pending Admin Approval
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2.4}>
            <Card sx={{ ...cardStyles, height: { xs: '120px', sm: '140px', md: '160px' } }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: { xs: 1.5, sm: 2, md: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <PersonAddIcon sx={{ 
                  fontSize: { xs: 24, sm: 32, md: 40 }, 
                  color: '#3498DB', 
                  mb: { xs: 0.5, sm: 1 } 
                }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#2C3E50', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                  }}
                >
                  {stats.approvedApplications}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#000000', 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                    lineHeight: 1.2
                  }}
                >
                  Newly Registered PWD
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2.4}>
            <Card sx={{ ...cardStyles, height: { xs: '120px', sm: '140px', md: '160px' } }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: { xs: 1.5, sm: 2, md: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <CreditCardIcon sx={{ 
                  fontSize: { xs: 24, sm: 32, md: 40 }, 
                  color: '#9B59B6', 
                  mb: { xs: 0.5, sm: 1 } 
                }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#2C3E50', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                  }}
                >
                  {stats.activeMembers}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#000000', 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                    lineHeight: 1.2
                  }}
                >
                  Unclaimed PWD Card
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2.4}>
            <Card sx={{ ...cardStyles, height: { xs: '120px', sm: '140px', md: '160px' } }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: { xs: 1.5, sm: 2, md: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <ReportIcon sx={{ 
                  fontSize: { xs: 24, sm: 32, md: 40 }, 
                  color: '#E74C3C', 
                  mb: { xs: 0.5, sm: 1 } 
                }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#2C3E50', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                  }}
                >
                  0
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#000000', 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                    lineHeight: 1.2
                  }}
                >
                  Complaints/Feedback
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>


      {/* Chart and Map Row */}
      <Grid item xs={12} lg={8}>
        {renderLineChart()}
      </Grid>
      
      <Grid item xs={12} lg={4}>
        {renderMapSection()}
      </Grid>

      {/* Recent Activity Panel */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ ...cardStyles, height: { xs: '400px', sm: '450px' } }}>
          <CardContent sx={{ height: '100%', p: { xs: 1, sm: 2 } }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',   
                color: '#000000',
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                mb: { xs: 1, sm: 2 }
              }}
            >
              RECENT ACTIVITY PANEL
            </Typography>
            <Box sx={{ 
              height: { xs: '320px', sm: '370px' }, 
              overflow: 'auto',
              border: '1px solid #E0E0E0',
              borderRadius: 1,
              backgroundColor: '#FFFFFF'
            }}>
              {activitiesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress size={40} />
                </Box>
              ) : recentActivities.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem sx={{ px: 2, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32, 
                            backgroundColor: activity.color,
                            color: '#FFFFFF'
                          }}>
                            {getActivityIcon(activity.icon)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#000000' }}>
                              {activity.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" sx={{ color: '#000000', display: 'block' }}>
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#7F8C8D', display: 'block' }}>
                                {activity.barangay} • {formatTimeAgo(activity.created_at)}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip 
                          label={activity.status} 
                          size="small"
                          sx={{
                            backgroundColor: activity.color,
                            color: '#FFFFFF',
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  flexDirection: 'column'
                }}>
                  <ScheduleIcon sx={{ fontSize: 48, color: '#BDC3C7', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#7F8C8D', textAlign: 'center' }}>
                    No recent activities
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Barangay Coordination Table */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ ...cardStyles, height: { xs: '400px', sm: '450px' } }}>
          <CardContent sx={{ height: '100%', p: { xs: 1, sm: 2 } }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: '#000000',
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                mb: { xs: 1, sm: 2 }
              }}
            >
              BARANGAY COORDINATION TABLE
            </Typography>
            <Box sx={{ 
              height: { xs: '320px', sm: '370px' }, 
              overflow: 'auto',
              border: '1px solid #E0E0E0',
              borderRadius: 1,
              backgroundColor: '#FFFFFF'
            }}>
              {contactsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress size={40} />
                </Box>
              ) : barangayContacts.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.75rem' }}>Barangay</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.75rem' }}>President</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.75rem' }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.75rem' }}>PWD Count</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.75rem' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {barangayContacts.map((contact) => (
                        <TableRow key={contact.barangay} hover>
                          <TableCell sx={{ fontSize: '0.75rem', color: '#000000' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <HomeIcon sx={{ fontSize: 16, color: '#3498DB' }} />
                              {contact.barangay}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', color: '#000000' }}>
                            {contact.president_name}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 12, color: '#27AE60' }} />
                                <Typography variant="caption" sx={{ color: '#000000' }}>
                                  {contact.phone}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 12, color: '#3498DB' }} />
                                <Typography variant="caption" sx={{ color: '#000000' }}>
                                  {contact.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', color: '#000000' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#000000' }}>
                                {contact.pwd_count} PWDs
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#F39C12' }}>
                                {contact.pending_applications} pending
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={contact.status} 
                              size="small"
                              sx={{
                                backgroundColor: contact.status === 'active' ? '#27AE60' : '#E74C3C',
                                color: '#FFFFFF',
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  flexDirection: 'column'
                }}>
                  <LocationIcon sx={{ fontSize: 48, color: '#BDC3C7', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#7F8C8D', textAlign: 'center' }}>
                    No barangay contacts available
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={mainContainerStyles}>
      {/* Admin Sidebar with Toggle */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          ...contentAreaStyles,
          flexGrow: 1,
          ml: { xs: 0, md: '280px' }, // Hide sidebar margin on mobile
          width: { xs: '100%', md: 'calc(100% - 280px)' },
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 1 } }}>
          {/* Mobile Menu Button */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            alignItems: 'center', 
            mb: 2,
            p: 1
          }}>
            <Button
              variant="outlined"
              startIcon={<MenuIcon />}
              onClick={handleSidebarToggle}
              sx={{
                color: '#566573',
                borderColor: '#D5DBDB',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#253D90',
                  background: '#F4F7FC',
                  color: '#253D90'
                }
              }}
            >
              Menu
            </Button>
          </Box>

          {/* Page Header */}
          <Box sx={{ mb: { xs: 2, md: 4 } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#000000', 
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
              }}
            >
              Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#000000',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Welcome back, {currentUser?.username || 'Admin'}. Here's what's happening with your PWD management system.
            </Typography>
          </Box>

          {/* Dashboard Content */}
          {renderOverview()}
        </Container>
      </Box>
    </Box>
  );
}

export default AdminDashboard;