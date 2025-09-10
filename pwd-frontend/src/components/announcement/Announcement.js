import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Badge
} from '@mui/material';
import {
  Campaign,
  Add,
  Edit,
  Delete,
  Visibility,
  Schedule,
  CheckCircle,
  Warning,
  Notifications,
  Public,
  PriorityHigh,
  Close
} from '@mui/icons-material';
import AdminSidebar from '../shared/AdminSidebar';
import announcementService from '../../services/announcementService';

const Announcement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: '',
    priority: '',
    targetAudience: '',
    status: 'Active',
    publishDate: '', // Will be set automatically by backend
    expiryDate: ''
  });

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAll();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch announcements');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData(announcement);
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        type: '',
        priority: '',
        targetAudience: '',
        status: 'Active',
        publishDate: '', // Will be set automatically by backend
        expiryDate: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAnnouncement(null);
  };

  const handleDeleteClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (announcementToDelete) {
        await announcementService.delete(announcementToDelete.announcementID);
        await fetchAnnouncements(); // Refresh the list
        setDeleteDialog(false);
        setAnnouncementToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      // You could add a toast notification here for better UX
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
    setAnnouncementToDelete(null);
  };

  const handleViewDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialog(false);
    setSelectedAnnouncement(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      if (editingAnnouncement) {
        // Update existing announcement
        await announcementService.update(editingAnnouncement.announcementID, formData);
        setSuccess('Announcement updated successfully!');
      } else {
        // Add new announcement - remove publishDate as it will be set automatically by backend
        const { publishDate, ...announcementData } = formData;
        await announcementService.create(announcementData);
        setSuccess('Announcement created successfully!');
      }
      
      // Refresh the announcements list
      await fetchAnnouncements();
      handleCloseDialog();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving announcement:', error);
      setError(error.response?.data?.error || 'Failed to save announcement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    return priority === 'High' ? '#E74C3C' : priority === 'Medium' ? '#F39C12' : '#27AE60';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Information': '#3498DB',
      'Event': '#27AE60',
      'Notice': '#F39C12',
      'Emergency': '#E74C3C'
    };
    return colors[type] || '#34495E';
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : status === 'Draft' ? 'warning' : 'error';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F7FC' }}>
      <AdminSidebar />
      
      {/* --- Main Content --- */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        ml: '280px',
        width: 'calc(100% - 280px)'
      }}>
        {/* Top Bar */}
        <Box sx={{
          bgcolor: '#FFFFFF',
          p: 2,
          borderBottom: '1px solid #E0E0E0',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#193a52',
              textTransform: 'none',
              fontWeight: 600,
              px: 4, py: 1,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#153a5a' }
            }}
          >
            Announcements
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              bgcolor: '#3498DB', 
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': { bgcolor: '#2980B9' } 
            }}
          >
            Create Announcement
          </Button>
        </Box>

        {/* Content Area */}
        <Box sx={{ flex: 1, p: 3, bgcolor: '#F4F7FC' }}>
          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Paper elevation={0} sx={{
            p: 3,
            border: '1px solid #E0E0E0',
            borderRadius: 4,
            bgcolor: '#2C3E50',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography sx={{ fontWeight: 700, mb: 3, color: '#FFFFFF', fontSize: '1.2rem' }}>
              ANNOUNCEMENTS MANAGEMENT
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={0} sx={{ 
                  border: '1px solid #455A64', 
                  bgcolor: '#34495E',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  '&:hover': { 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <Notifications sx={{ fontSize: 40, color: '#3498DB', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                    6
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E0E0E0', fontWeight: 500 }}>
                    Active Announcements
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={0} sx={{ 
                  border: '1px solid #455A64', 
                  bgcolor: '#34495E',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  '&:hover': { 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <Public sx={{ fontSize: 40, color: '#27AE60', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                    5,330
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E0E0E0', fontWeight: 500 }}>
                    Total Views
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={0} sx={{ 
                  border: '1px solid #455A64', 
                  bgcolor: '#34495E',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  '&:hover': { 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <PriorityHigh sx={{ fontSize: 40, color: '#E74C3C', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                    2
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E0E0E0', fontWeight: 500 }}>
                    High Priority
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={0} sx={{ 
                  border: '1px solid #455A64', 
                  bgcolor: '#34495E',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  '&:hover': { 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <Campaign sx={{ fontSize: 40, color: '#9B59B6', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                    3
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E0E0E0', fontWeight: 500 }}>
                    Event Announcements
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Loading and Error States */}
            {loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography sx={{ color: '#E0E0E0' }}>Loading announcements...</Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Announcements Grid */}
            {!loading && !error && (
              <>
                <Typography sx={{ fontWeight: 600, mb: 2, color: '#FFFFFF', fontSize: '1.2rem' }}>
                  CURRENT ANNOUNCEMENTS
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {announcements.map((announcement) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={announcement.announcementID}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          border: '1px solid #E0E0E0',
                          borderRadius: 2,
                          height: '280px', // Fixed height
                          width: '100%', // Fixed width
                          display: 'flex',
                          flexDirection: 'column',
                          p: 2,
                          bgcolor: '#2C3E50',
                          overflow: 'hidden', // Prevent content overflow
                          '&:hover': { 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Chip 
                              label={announcement.type} 
                              size="small" 
                              sx={{ 
                                bgcolor: '#3498DB', 
                                color: '#FFFFFF',
                                fontWeight: 600,
                                fontSize: '0.6rem',
                                height: '20px'
                              }}
                            />
                            <Chip 
                              label={announcement.priority} 
                              size="small" 
                              sx={{ 
                                bgcolor: getPriorityColor(announcement.priority) === 'success' ? '#27AE60' : 
                                       getPriorityColor(announcement.priority) === 'warning' ? '#F39C12' : '#E74C3C', 
                                color: '#FFFFFF',
                                fontWeight: 600,
                                fontSize: '0.6rem',
                                height: '20px'
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewDetails(announcement)}
                              sx={{ color: '#3498DB', '&:hover': { bgcolor: 'rgba(52, 152, 219, 0.1)' } }}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDialog(announcement)}
                              sx={{ color: '#FFFFFF', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteClick(announcement)}
                              sx={{ color: '#E74C3C', '&:hover': { bgcolor: 'rgba(231, 76, 60, 0.1)' } }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 1, 
                            color: '#FFFFFF', 
                            fontSize: '1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: 1.2
                          }}
                        >
                          {announcement.title}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: '#E0E0E0', 
                            mb: 1, 
                            lineHeight: 1.4, 
                            fontSize: '0.8rem',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            flex: 1,
                            minHeight: '0'
                          }}
                        >
                          {announcement.content}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography sx={{ color: '#B0BEC5', fontWeight: 500, fontSize: '0.7rem' }}>
                            Target: {announcement.targetAudience}
                          </Typography>
                          <Typography sx={{ color: '#B0BEC5', fontWeight: 500, fontSize: '0.7rem' }}>
                            Views: {announcement.views}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Typography sx={{ color: '#4CAF50', fontWeight: 600, fontSize: '0.7rem' }}>
                            Published: {announcement.publishDate}
                          </Typography>
                          <Typography sx={{ color: '#FF9800', fontWeight: 600, fontSize: '0.7rem' }}>
                            Expires: {announcement.expiryDate}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Quick Actions */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<Schedule />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#3498DB',
                  color: '#3498DB',
                  '&:hover': { 
                    bgcolor: '#3498DB', 
                    color: '#FFFFFF',
                    borderColor: '#3498DB'
                  }
                }}
              >
                Schedule Announcement
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Public />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#27AE60',
                  color: '#27AE60',
                  '&:hover': { 
                    bgcolor: '#27AE60', 
                    color: '#FFFFFF',
                    borderColor: '#27AE60'
                  }
                }}
              >
                Publish All Drafts
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Delete />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#E74C3C',
                  color: '#E74C3C',
                  '&:hover': { 
                    bgcolor: '#E74C3C', 
                    color: '#FFFFFF',
                    borderColor: '#E74C3C'
                  }
                }}
              >
                Archive Old
              </Button>
            </Box>

            {/* Add/Edit Announcement Dialog */}
            <Dialog 
              open={openDialog} 
              onClose={handleCloseDialog} 
              maxWidth="md" 
              fullWidth
              PaperProps={{
                sx: {
                  bgcolor: '#2C3E50',
                  color: '#FFFFFF',
                  borderRadius: 2
                }
              }}
            >
              <DialogTitle sx={{ 
                color: '#FFFFFF', 
                fontWeight: 700, 
                fontSize: '1.2rem',
                borderBottom: '1px solid #34495E'
              }}>
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Announcement Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      margin="normal"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#34495E',
                          color: '#FFFFFF',
                          '& fieldset': {
                            borderColor: '#5D6D7E',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3498DB',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3498DB',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B0BEC5',
                          '&.Mui-focused': {
                            color: '#3498DB',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#FFFFFF',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      margin="normal"
                      multiline
                      rows={4}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#34495E',
                          color: '#FFFFFF',
                          '& fieldset': {
                            borderColor: '#5D6D7E',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3498DB',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3498DB',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B0BEC5',
                          '&.Mui-focused': {
                            color: '#3498DB',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#FFFFFF',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: '#B0BEC5' }}>Type</InputLabel>
                      <Select
                        value={formData.type}
                        label="Type"
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        sx={{
                          bgcolor: '#34495E',
                          color: '#FFFFFF',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#5D6D7E',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3498DB',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3498DB',
                          },
                          '& .MuiSelect-icon': {
                            color: '#B0BEC5',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#34495E',
                              '& .MuiMenuItem-root': {
                                color: '#FFFFFF',
                                '&:hover': {
                                  bgcolor: '#5D6D7E',
                                },
                                '&.Mui-selected': {
                                  bgcolor: '#3498DB',
                                },
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="Information">Information</MenuItem>
                        <MenuItem value="Event">Event</MenuItem>
                        <MenuItem value="Notice">Notice</MenuItem>
                        <MenuItem value="Emergency">Emergency</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: '#B0BEC5' }}>Priority</InputLabel>
                      <Select
                        value={formData.priority}
                        label="Priority"
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        sx={{
                          bgcolor: '#34495E',
                          color: '#FFFFFF',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#5D6D7E',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3498DB',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3498DB',
                          },
                          '& .MuiSelect-icon': {
                            color: '#B0BEC5',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#34495E',
                              '& .MuiMenuItem-root': {
                                color: '#FFFFFF',
                                '&:hover': {
                                  bgcolor: '#5D6D7E',
                                },
                                '&.Mui-selected': {
                                  bgcolor: '#3498DB',
                                },
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: '#B0BEC5' }}>Target Audience (Barangay)</InputLabel>
                      <Select
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#34495E',
                            color: '#FFFFFF',
                            '& fieldset': {
                              borderColor: '#5D6D7E',
                            },
                            '&:hover fieldset': {
                              borderColor: '#3498DB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#3498DB',
                            },
                          },
                          '& .MuiSelect-select': {
                            color: '#FFFFFF',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#34495E',
                              '& .MuiMenuItem-root': {
                                color: '#FFFFFF',
                                '&:hover': {
                                  bgcolor: '#3498DB',
                                },
                                '&.Mui-selected': {
                                  bgcolor: '#3498DB',
                                },
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="Baclaran">Baclaran</MenuItem>
                        <MenuItem value="Banay-Banay">Banay-Banay</MenuItem>
                        <MenuItem value="Banlic">Banlic</MenuItem>
                        <MenuItem value="Bigaa">Bigaa</MenuItem>
                        <MenuItem value="Butong">Butong</MenuItem>
                        <MenuItem value="Casile">Casile</MenuItem>
                        <MenuItem value="Diezmo">Diezmo</MenuItem>
                        <MenuItem value="Gulod">Gulod</MenuItem>
                        <MenuItem value="Mamatid">Mamatid</MenuItem>
                        <MenuItem value="Marinig">Marinig</MenuItem>
                        <MenuItem value="Niugan">Niugan</MenuItem>
                        <MenuItem value="Pittland">Pittland</MenuItem>
                        <MenuItem value="Pob. Uno">Pob. Uno</MenuItem>
                        <MenuItem value="Pob. Dos">Pob. Dos</MenuItem>
                        <MenuItem value="Pob. Tres">Pob. Tres</MenuItem>
                        <MenuItem value="Pulo">Pulo</MenuItem>
                        <MenuItem value="Sala">Sala</MenuItem>
                        <MenuItem value="San Isidro">San Isidro</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      required
                      helperText="Publish date will be automatically set to today's date"
                      FormHelperTextProps={{
                        sx: {
                          color: '#B0BEC5',
                          fontSize: '0.75rem'
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#34495E',
                          color: '#FFFFFF',
                          '& fieldset': {
                            borderColor: '#5D6D7E',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3498DB',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3498DB',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B0BEC5',
                          '&.Mui-focused': {
                            color: '#3498DB',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#FFFFFF',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: '#B0BEC5' }}>Status</InputLabel>
                      <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        sx={{
                          bgcolor: '#34495E',
                          color: '#FFFFFF',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#5D6D7E',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3498DB',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3498DB',
                          },
                          '& .MuiSelect-icon': {
                            color: '#B0BEC5',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#34495E',
                              '& .MuiMenuItem-root': {
                                color: '#FFFFFF',
                                '&:hover': {
                                  bgcolor: '#5D6D7E',
                                },
                                '&.Mui-selected': {
                                  bgcolor: '#3498DB',
                                },
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="Draft">Draft</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Archived">Archived</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ 
                borderTop: '1px solid #34495E',
                p: 2,
                gap: 1
              }}>
                <Button 
                  onClick={handleCloseDialog}
                  sx={{ 
                    color: '#B0BEC5',
                    '&:hover': { bgcolor: 'rgba(176, 190, 197, 0.1)' }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={submitting}
                  sx={{ 
                    bgcolor: '#3498DB',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: '#2980B9' },
                    '&:disabled': { bgcolor: '#7F8C8D' }
                  }}
                >
                  {submitting ? 'Creating...' : (editingAnnouncement ? 'Update' : 'Create')}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog 
              open={deleteDialog} 
              onClose={handleDeleteCancel}
              PaperProps={{
                sx: {
                  bgcolor: '#2C3E50',
                  color: '#FFFFFF',
                  borderRadius: 2,
                  minWidth: 400
                }
              }}
            >
              <DialogTitle sx={{ 
                color: '#FFFFFF', 
                fontWeight: 700, 
                fontSize: '1.2rem',
                borderBottom: '1px solid #34495E'
              }}>
                Delete Announcement
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Typography sx={{ color: '#E0E0E0', mb: 2 }}>
                  Are you sure you want to delete "{announcementToDelete?.title}"?
                </Typography>
                <Typography sx={{ color: '#B0BEC5', fontSize: '0.9rem' }}>
                  This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions sx={{ 
                borderTop: '1px solid #34495E',
                p: 2,
                gap: 1
              }}>
                <Button 
                  onClick={handleDeleteCancel}
                  sx={{ 
                    color: '#B0BEC5',
                    '&:hover': { bgcolor: 'rgba(176, 190, 197, 0.1)' }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeleteConfirm}
                  variant="contained"
                  sx={{ 
                    bgcolor: '#E74C3C',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: '#C0392B' }
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* View Details Dialog */}
            <Dialog open={viewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
              <DialogTitle sx={{ 
                backgroundColor: '#2C3E50',
                color: 'white !important', 
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Campaign sx={{ color: '#3498DB' }} />
                  <Typography variant="h6" sx={{ color: 'white !important' }}>
                    Announcement Details
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseViewDialog} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent 
                sx={{ 
                  backgroundColor: '#2C3E50 !important',
                  color: 'white !important',
                  '& *': { 
                    color: 'white !important',
                    '& .MuiTypography-root': { color: 'white !important' },
                    '& .MuiChip-root': { color: 'white !important' },
                    '& .MuiChip-label': { color: 'white !important' },
                    '& .MuiBox-root': { color: 'white !important' },
                    '& .MuiGrid-root': { color: 'white !important' },
                    '& p': { color: 'white !important' },
                    '& span': { color: 'white !important' },
                    '& div': { color: 'white !important' }
                  }
                }}
                style={{
                  backgroundColor: '#2C3E50',
                  color: 'white',
                  '--text-color': 'white'
                }}
              >
                {selectedAnnouncement && (
                  <Box sx={{ mt: 1 }}>
                    {/* Header with title and chips */}
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ fontWeight: 700, color: 'white !important', mb: 2, backgroundColor: '#3498DB', p: 1, borderRadius: 1 }}
                        style={{ color: 'white' }}
                      >
                        {selectedAnnouncement.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={selectedAnnouncement.type}
                          sx={{
                            backgroundColor: '#3498DB',
                            color: 'white',
                            fontWeight: 600,
                            '& .MuiChip-label': { color: 'white' }
                          }}
                          style={{ color: 'white' }}
                        />
                        <Chip
                          label={selectedAnnouncement.priority}
                          sx={{
                            backgroundColor: getPriorityColor(selectedAnnouncement.priority) === 'success' ? '#27AE60' : 
                                           getPriorityColor(selectedAnnouncement.priority) === 'warning' ? '#F39C12' : '#E74C3C',
                            color: 'white',
                            fontWeight: 600,
                            '& .MuiChip-label': { color: 'white' }
                          }}
                          style={{ color: 'white' }}
                        />
                        <Chip
                          label={selectedAnnouncement.status}
                          sx={{
                            backgroundColor: selectedAnnouncement.status === 'Active' ? '#27AE60' : 
                                           selectedAnnouncement.status === 'Draft' ? '#F39C12' : '#E74C3C',
                            color: 'white',
                            fontWeight: 600,
                            '& .MuiChip-label': { color: 'white' }
                          }}
                          style={{ color: 'white' }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ borderTop: '1px solid #BDC3C7', mb: 3 }} />

                    {/* Content */}
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ fontWeight: 600, color: 'white !important', mb: 1, backgroundColor: '#3498DB', p: 1, borderRadius: 1 }}
                        style={{ color: 'white' }}
                      >
                        Content
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ color: 'white !important', lineHeight: 1.8, backgroundColor: '#34495E', p: 2, borderRadius: 1 }}
                        style={{ color: 'white' }}
                      >
                        {selectedAnnouncement.content}
                      </Typography>
                    </Box>

                    <Box sx={{ borderTop: '1px solid #BDC3C7', mb: 3 }} />

                    {/* Details Grid */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography 
                          variant="h6" 
                          sx={{ fontWeight: 600, color: 'white !important', mb: 2, backgroundColor: '#3498DB', p: 1, borderRadius: 1 }}
                          style={{ color: 'white' }}
                        >
                          Announcement Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ color: '#BDC3C7 !important', fontWeight: 600 }}
                              style={{ color: '#BDC3C7' }}
                            >
                              Target Audience
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ color: 'white !important' }}
                              style={{ color: 'white' }}
                            >
                              {selectedAnnouncement.targetAudience}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ color: '#BDC3C7 !important', fontWeight: 600 }}
                              style={{ color: '#BDC3C7' }}
                            >
                              Publish Date
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ color: 'white !important' }}
                              style={{ color: 'white' }}
                            >
                              {new Date(selectedAnnouncement.publishDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ color: '#BDC3C7 !important', fontWeight: 600 }}
                              style={{ color: '#BDC3C7' }}
                            >
                              Expiry Date
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ color: 'white !important' }}
                              style={{ color: 'white' }}
                            >
                              {new Date(selectedAnnouncement.expiryDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography 
                          variant="h6" 
                          sx={{ fontWeight: 600, color: 'white !important', mb: 2, backgroundColor: '#3498DB', p: 1, borderRadius: 1 }}
                          style={{ color: 'white' }}
                        >
                          Statistics
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ color: '#BDC3C7 !important', fontWeight: 600 }}
                              style={{ color: '#BDC3C7' }}
                            >
                              Views
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ color: 'white !important' }}
                              style={{ color: 'white' }}
                            >
                              {selectedAnnouncement.views || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ color: '#BDC3C7 !important', fontWeight: 600 }}
                              style={{ color: '#BDC3C7' }}
                            >
                              Created
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ color: 'white !important' }}
                              style={{ color: 'white' }}
                            >
                              {new Date(selectedAnnouncement.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ color: '#BDC3C7 !important', fontWeight: 600 }}
                              style={{ color: '#BDC3C7' }}
                            >
                              Last Updated
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ color: 'white !important' }}
                              style={{ color: 'white' }}
                            >
                              {new Date(selectedAnnouncement.updated_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3, backgroundColor: '#2C3E50' }}>
                <Button 
                  onClick={handleCloseViewDialog} 
                  variant="contained"
                  sx={{ 
                    bgcolor: '#3498DB',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#2980B9'
                    }
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Announcement;
