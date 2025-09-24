import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  Accessibility as AccessibilityIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import PWDMemberSidebar from '../shared/PWDMemberSidebar';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function PWDProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  
  // Password change popup states
  const [passwordSuccessDialog, setPasswordSuccessDialog] = useState(false);
  const [passwordErrorDialog, setPasswordErrorDialog] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    birthDate: '',
    gender: '',
    disabilityType: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
    refreshUserData(); // Refresh user data to get latest idPictures
  }, []);

  // Refresh user data from login endpoint to get updated idPictures
  const refreshUserData = async () => {
    try {
      console.log('=== Refresh User Data Debug ===');
      console.log('Current User:', currentUser);
      console.log('Current User PWD Member:', currentUser?.pwd_member);
      
      // Try to get fresh data from the mock-pwd endpoint
      const response = await api.get('/mock-pwd');
      console.log('Mock PWD Response:', response);
      
      if (response && response.members) {
        // Find the current user in the members list
        const currentMember = response.members.find(member => 
          member.userID === currentUser?.userID || 
          member.email === currentUser?.email
        );
        
        console.log('Found Current Member:', currentMember);
        
        if (currentMember && currentMember.idPictures) {
          console.log('Member has ID Pictures:', currentMember.idPictures);
          
          // Update the profile state with the ID pictures
          if (profile) {
            setProfile({
              ...profile,
              idPictures: currentMember.idPictures
            });
            console.log('Updated profile with ID pictures');
          }
        } else {
          console.log('No ID pictures found for current member');
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Generate QR code when profile loads
  useEffect(() => {
    if (profile) {
      generateQRCode();
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== Fetch Profile Debug ===');
      console.log('Current User:', currentUser);
      console.log('Current User PWD Member:', currentUser?.pwd_member);
      
      // Use current user data if API fails
      if (currentUser && currentUser.pwd_member) {
        const pwdMember = currentUser.pwd_member;
        console.log('PWD Member Data:', pwdMember);
        console.log('PWD Member ID Pictures:', pwdMember.idPictures);
        
        const profileData = {
          userID: currentUser.userID,
          firstName: pwdMember.firstName,
          lastName: pwdMember.lastName,
          email: currentUser.email,
          contactNumber: pwdMember.contactNumber,
          address: pwdMember.address,
          birthDate: pwdMember.birthDate,
          gender: pwdMember.gender,
          disabilityType: pwdMember.disabilityType,
          pwd_id: pwdMember.pwd_id,
          barangay: currentUser.barangay,
          created_at: pwdMember.created_at,
          idPictures: pwdMember.idPictures // Add ID pictures to profile data
        };
        
        console.log('Profile Data Created:', profileData);
        console.log('Profile Data ID Pictures:', profileData.idPictures);
        
        setProfile(profileData);
        setFormData({
          firstName: pwdMember.firstName || '',
          lastName: pwdMember.lastName || '',
          email: currentUser.email || '',
          contactNumber: pwdMember.contactNumber || '',
          address: pwdMember.address || '',
          birthDate: pwdMember.birthDate || '',
          gender: pwdMember.gender || '',
          disabilityType: pwdMember.disabilityType || ''
        });
      } else {
        // Try to fetch from API
        const response = await api.get('/pwd-member/profile');
        setProfile(response);
        
        // Set form data
        setFormData({
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          email: response.email || '',
          contactNumber: response.contactNumber || '',
          address: response.address || '',
          birthDate: response.birthDate || '',
          gender: response.gender || '',
          disabilityType: response.disabilityType || ''
        });
      }
      
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
      
      // Fallback to current user data
      if (currentUser && currentUser.pwd_member) {
        const pwdMember = currentUser.pwd_member;
        const profileData = {
          userID: currentUser.userID,
          firstName: pwdMember.firstName,
          lastName: pwdMember.lastName,
          email: currentUser.email,
          contactNumber: pwdMember.contactNumber,
          address: pwdMember.address,
          birthDate: pwdMember.birthDate,
          gender: pwdMember.gender,
          disabilityType: pwdMember.disabilityType,
          pwd_id: pwdMember.pwd_id,
          barangay: currentUser.barangay,
          created_at: pwdMember.created_at,
          idPictures: pwdMember.idPictures // Add ID pictures to fallback profile data
        };
        
        setProfile(profileData);
        setFormData({
          firstName: pwdMember.firstName || '',
          lastName: pwdMember.lastName || '',
          email: currentUser.email || '',
          contactNumber: pwdMember.contactNumber || '',
          address: pwdMember.address || '',
          birthDate: pwdMember.birthDate || '',
          gender: pwdMember.gender || '',
          disabilityType: pwdMember.disabilityType || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code for the profile
  const generateQRCode = async () => {
    if (!profile) return;
    
    try {
      const QRCode = await import('qrcode');
      
      const memberData = {
        pwd_id: profile.pwd_id || `PWD-${profile.userID?.toString().padStart(6, '0')}`,
        userID: profile.userID,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        barangay: profile.barangay,
        disabilityType: profile.disabilityType,
        birthDate: profile.birthDate,
        generatedAt: new Date().toISOString()
      };

      const qrDataURL = await QRCode.toDataURL(JSON.stringify(memberData), {
        width: 120,
        height: 120,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        rendererOpts: {
          quality: 0.92
        }
      });
      
      setQrCodeDataURL(qrDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await api.put('/pwd-member/profile', formData);
      
      setSuccess('✅ Profile updated successfully! Your changes have been saved.');
      setEditMode(false);
      await fetchProfile(); // Refresh data
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordErrorMessage('New passwords do not match. Please make sure both password fields are identical.');
        setPasswordErrorDialog(true);
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setPasswordErrorMessage('Password must be at least 6 characters long.');
        setPasswordErrorDialog(true);
        return;
      }
      
      setSaving(true);
      setError(null);
      
      await api.put('/pwd-member/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Show success popup
      setPasswordSuccessDialog(true);
      setPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      console.error('Error changing password:', err);
      
      // Show error popup
      if (err.response?.data?.error === 'Current password is incorrect') {
        setPasswordErrorMessage('Current password is incorrect. Please check your password and try again.');
      } else {
        setPasswordErrorMessage('Failed to change password: ' + (err.message || 'Unknown error'));
      }
      setPasswordErrorDialog(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      contactNumber: profile?.contactNumber || '',
      address: profile?.address || '',
      birthDate: profile?.birthDate || '',
      gender: profile?.gender || '',
      disabilityType: profile?.disabilityType || ''
    });
    setError(null);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAge = (birthDate) => {
    if (!birthDate) return 'Not provided';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#2C3E50' }}>
        <PWDMemberSidebar />
        <Box sx={{ 
          flexGrow: 1, 
          p: 3, 
          ml: { xs: 0, md: '280px' }, // Responsive margin for sidebar
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#2C3E50',
          width: { xs: '100%', md: 'calc(100% - 280px)' } // Ensure proper width calculation
        }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#2C3E50' }}>
      <PWDMemberSidebar />
      
      {/* Main content */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        ml: { xs: 0, md: '280px' }, // Responsive margin for sidebar
        minHeight: '100vh',
        bgcolor: '#2C3E50',
        width: { xs: '100%', md: 'calc(100% - 280px)' } // Ensure proper width calculation
      }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
            My Profile
          </Typography>
          <Typography variant="body1" sx={{ color: '#BDC3C7' }}>
            Manage your personal information and account settings
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              border: '2px solid #4CAF50',
              backgroundColor: '#E8F5E8',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              },
              '& .MuiAlert-message': {
                fontSize: '1rem',
                fontWeight: 600,
                color: '#2E7D32'
              }
            }} 
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Edit Profile Section */}
          {editMode && (
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                  p: 3,
                  color: 'white'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                    EDIT PROFILE
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'white', fontWeight: 500 }}>
                    Update your personal information
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 3, bgcolor: '#2C3E50' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoFocus={false}
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#34495E',
                            color: '#FFFFFF',
                            '& fieldset': { borderColor: '#5D6D7E' },
                            '&:hover fieldset': { borderColor: '#3498DB' },
                            '&.Mui-focused fieldset': { borderColor: '#3498DB' },
                          },
                          '& .MuiInputLabel-root': { color: '#BDC3C7', '&.Mui-focused': { color: '#3498DB' } },
                          '& .MuiInputBase-input': { color: '#FFFFFF' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoFocus={false}
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#34495E',
                            color: '#FFFFFF',
                            '& fieldset': { borderColor: '#5D6D7E' },
                            '&:hover fieldset': { borderColor: '#3498DB' },
                            '&.Mui-focused fieldset': { borderColor: '#3498DB' },
                          },
                          '& .MuiInputLabel-root': { color: '#BDC3C7', '&.Mui-focused': { color: '#3498DB' } },
                          '& .MuiInputBase-input': { color: '#FFFFFF' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoFocus={false}
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#34495E',
                            color: '#FFFFFF',
                            '& fieldset': { borderColor: '#5D6D7E' },
                            '&:hover fieldset': { borderColor: '#3498DB' },
                            '&.Mui-focused fieldset': { borderColor: '#3498DB' },
                          },
                          '& .MuiInputLabel-root': { color: '#BDC3C7', '&.Mui-focused': { color: '#3498DB' } },
                          '& .MuiInputBase-input': { color: '#FFFFFF' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoFocus={false}
                        fullWidth
                        label="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#34495E',
                            color: '#FFFFFF',
                            '& fieldset': { borderColor: '#5D6D7E' },
                            '&:hover fieldset': { borderColor: '#3498DB' },
                            '&.Mui-focused fieldset': { borderColor: '#3498DB' },
                          },
                          '& .MuiInputLabel-root': { color: '#BDC3C7', '&.Mui-focused': { color: '#3498DB' } },
                          '& .MuiInputBase-input': { color: '#FFFFFF' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        autoFocus={false}
                        fullWidth
                        label="Address"
                        name="address"
                        multiline
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#34495E',
                            color: '#FFFFFF',
                            '& fieldset': { borderColor: '#5D6D7E' },
                            '&:hover fieldset': { borderColor: '#3498DB' },
                            '&.Mui-focused fieldset': { borderColor: '#3498DB' },
                          },
                          '& .MuiInputLabel-root': { color: '#BDC3C7', '&.Mui-focused': { color: '#3498DB' } },
                          '& .MuiInputBase-input': { color: '#FFFFFF' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        autoFocus={false}
                        fullWidth
                        label="Birth Date"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#34495E',
                            color: '#FFFFFF',
                            '& fieldset': { borderColor: '#5D6D7E' },
                            '&:hover fieldset': { borderColor: '#3498DB' },
                            '&.Mui-focused fieldset': { borderColor: '#3498DB' },
                          },
                          '& .MuiInputLabel-root': { color: '#BDC3C7', '&.Mui-focused': { color: '#3498DB' } },
                          '& .MuiInputBase-input': { color: '#FFFFFF' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#BDC3C7', '&.Mui-focused': { color: '#3498DB' } }}>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          autoFocus={false}
                          sx={{
                            bgcolor: '#34495E',
                            color: '#FFFFFF',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#5D6D7E' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3498DB' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3498DB' },
                          }}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#BDC3C7', '&.Mui-focused': { color: '#3498DB' } }}>Disability Type</InputLabel>
                        <Select
                          name="disabilityType"
                          value={formData.disabilityType}
                          onChange={handleInputChange}
                          autoFocus={false}
                          sx={{
                            bgcolor: '#34495E',
                            color: '#FFFFFF',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#5D6D7E' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3498DB' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3498DB' },
                          }}
                        >
                          <MenuItem value="Visual Impairment">Visual Impairment</MenuItem>
                          <MenuItem value="Hearing Impairment">Hearing Impairment</MenuItem>
                          <MenuItem value="Physical Impairment">Physical Impairment</MenuItem>
                          <MenuItem value="Intellectual Disability">Intellectual Disability</MenuItem>
                          <MenuItem value="Mental Health Condition">Mental Health Condition</MenuItem>
                          <MenuItem value="Multiple Disabilities">Multiple Disabilities</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={saving}
                          sx={{
                            bgcolor: '#27AE60',
                            color: '#FFFFFF',
                            '&:hover': { bgcolor: '#229954' },
                            '&:disabled': { bgcolor: '#7F8C8D' }
                          }}
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                          sx={{ color: '#BDC3C7', borderColor: '#BDC3C7' }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* PWD ID Card & Account Information */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {/* PWD ID Card */}
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 1, 
                  boxShadow: 4, 
                  overflow: 'hidden',
                  border: '3px solid #1976d2',
                  bgcolor: 'white',
                  minHeight: '400px',
                  maxWidth: '100%'
                }}>
                  {/* Header Section */}
                  <Box sx={{ 
                    p: 2.5,
                    textAlign: 'center',
                    borderBottom: '2px solid #1976d2',
                    bgcolor: '#f8f9fa'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black', fontSize: '0.75rem', mb: 0.5 }}>
                      REPUBLIC OF THE PHILIPPINES
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black', fontSize: '0.75rem', mb: 0.5 }}>
                      PROVINCE OF LAGUNA
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.2rem', mt: 0.5, mb: 0.5 }}>
                      CITY OF CABUYAO
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black', fontSize: '0.7rem' }}>
                      (P.D.A.O)
                    </Typography>
                  </Box>
                  
                  {/* Main Content */}
                  <Box sx={{ p: 2.5, display: 'flex', minHeight: '320px', bgcolor: 'white' }}>
                    {/* Left Column - Personal Info */}
                    <Box sx={{ flex: 1, pr: 2 }}>
                      {/* Name Field */}
                      <Box sx={{ mb: 2.5 }}>
                        <Box sx={{ 
                          height: '25px', 
                          borderBottom: '2px solid #333',
                          mb: 0.5,
                          bgcolor: 'white'
                        }} />
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          color: '#333', 
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px'
                        }}>
                          NAME
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          color: '#1976d2', 
                          textAlign: 'center',
                          fontSize: '1rem',
                          mt: 0.5
                        }}>
                          {profile?.firstName} {profile?.lastName}
                        </Typography>
                      </Box>
                      
                      {/* Disability Type Field */}
                      <Box sx={{ mb: 2.5 }}>
                        <Box sx={{ 
                          height: '25px', 
                          borderBottom: '2px solid #333',
                          mb: 0.5,
                          bgcolor: 'white'
                        }} />
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          color: '#333', 
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px'
                        }}>
                          TYPE OF DISABILITY
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          color: '#1976d2', 
                          textAlign: 'center',
                          fontSize: '1rem',
                          mt: 0.5
                        }}>
                          {profile?.disabilityType || 'Not specified'}
                        </Typography>
                      </Box>
                      
                      {/* Signature Field */}
                      <Box sx={{ mb: 2.5 }}>
                        <Box sx={{ 
                          height: '25px', 
                          borderBottom: '2px solid #333',
                          mb: 0.5,
                          bgcolor: 'white'
                        }} />
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          color: '#333', 
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px'
                        }}>
                          SIGNATURE
                        </Typography>
                      </Box>
                      
                      {/* Philippine Flag */}
                      <Box sx={{ 
                        width: '45px', 
                        height: '30px', 
                        border: '1px solid #ddd',
                        mt: 1,
                        position: 'relative',
                        bgcolor: 'white',
                        borderRadius: '2px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        {/* Flag stripes */}
                        <Box sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '10px',
                          bgcolor: '#0033A0'
                        }} />
                        <Box sx={{ 
                          position: 'absolute',
                          top: '20px',
                          left: 0,
                          width: '100%',
                          height: '10px',
                          bgcolor: '#CE1126'
                        }} />
                        {/* Triangle */}
                        <Box sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '18px',
                          height: '100%',
                          bgcolor: 'white',
                          clipPath: 'polygon(0 0, 0 100%, 100% 50%)'
                        }} />
                        {/* Sun */}
                        <Box sx={{ 
                          position: 'absolute',
                          top: '10px',
                          left: '4px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          bgcolor: '#FCD116'
                        }} />
                      </Box>
                    </Box>
                    
                    {/* Right Column - ID Number and Photo */}
                    <Box sx={{ flex: 1, pl: 2 }}>
                      {/* ID Number */}
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        fontSize: '0.8rem',
                        mb: 1,
                        letterSpacing: '0.5px'
                      }}>
                        ID No.
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        color: '#1976d2',
                        fontSize: '1.1rem',
                        mb: 2
                      }}>
                        {profile?.pwd_id || `PWD-${profile?.userID?.toString().padStart(6, '0') || 'N/A'}`}
                      </Typography>
                      
                      {/* ID Picture */}
                      <Box sx={{ 
                        width: '130px',
                        height: '130px',
                        border: '3px solid #ddd',
                        bgcolor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        mb: 2,
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        mx: 'auto' // Center the square container
                      }}>
                        {(() => {
                          // Debug logging
                          console.log('=== User Profile ID Picture Debug ===');
                          console.log('Profile data:', profile);
                          console.log('ID Pictures:', profile?.idPictures);
                          
                          if (!profile?.idPictures) {
                            console.log('No ID pictures found in profile');
                            return (
                              <>
                                {/* X lines */}
                                <Box sx={{ 
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '15%',
                                    right: '15%',
                                    height: '3px',
                                    bgcolor: '#bbb',
                                    transform: 'rotate(45deg)'
                                  },
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '15%',
                                    right: '15%',
                                    height: '3px',
                                    bgcolor: '#bbb',
                                    transform: 'rotate(-45deg)'
                                  }
                                }} />
                                {/* Avatar as fallback */}
                                <Avatar
                                  sx={{
                                    width: 85,
                                    height: 85,
                                    bgcolor: '#1976d2',
                                    fontSize: '1.6rem',
                                    zIndex: 1,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                  }}
                                >
                                  {getInitials(formData.firstName, formData.lastName)}
                                </Avatar>
                              </>
                            );
                          }
                          
                          let imagePath = null;
                          
                          // Handle different data formats
                          if (Array.isArray(profile.idPictures)) {
                            imagePath = profile.idPictures[0];
                            console.log('Array format - first image:', imagePath);
                          } else if (typeof profile.idPictures === 'string') {
                            try {
                              const parsed = JSON.parse(profile.idPictures);
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                imagePath = parsed[0];
                                console.log('String format - parsed first image:', imagePath);
                              }
                            } catch (e) {
                              console.error('Failed to parse idPictures string:', e);
                            }
                          }
                          
                          if (imagePath) {
                            const fullUrl = `http://127.0.0.1:8000/storage/${imagePath}`;
                            console.log('Final image URL:', fullUrl);
                            
                            return (
                              <img
                                src={fullUrl}
                                alt="ID Picture"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0
                                }}
                                onError={(e) => {
                                  console.error('Image load error for:', fullUrl);
                                  e.target.style.display = 'none';
                                  // Show fallback avatar
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                                onLoad={() => {
                                  console.log('Image loaded successfully:', fullUrl);
                                }}
                              />
                            );
                          }
                          
                          console.log('No valid image path found');
                          return null;
                        })()}
                        
                        {/* Fallback Avatar (hidden by default) */}
                        <Avatar
                          sx={{
                            width: 85,
                            height: 85,
                            bgcolor: '#1976d2',
                            fontSize: '1.6rem',
                            zIndex: 1,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            display: 'none'
                          }}
                        >
                          {getInitials(formData.firstName, formData.lastName)}
                        </Avatar>
                      </Box>
                      
                      {/* Additional Info */}
                      <Box sx={{ fontSize: '0.75rem', color: '#333' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: '#333' }}>
                          Birth: {formData.birthDate ? formatDate(formData.birthDate) : 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: '#333' }}>
                          Gender: {formData.gender || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: '#333' }}>
                          Address: {(() => {
                            const addressParts = [];
                            
                            // Add complete address if available
                            if (formData.address) {
                              addressParts.push(formData.address);
                            }
                            
                            // Add barangay if available
                            if (profile?.barangay && profile.barangay !== 'N/A') {
                              addressParts.push(profile.barangay);
                            }
                            
                            // Add city (default to Cabuyao if not specified)
                            const city = profile?.city && profile.city !== 'N/A' 
                              ? profile.city 
                              : 'Cabuyao';
                            addressParts.push(city);
                            
                            // Add province (default to Laguna if not specified)
                            const province = profile?.province && profile.province !== 'N/A' 
                              ? profile.province 
                              : 'Laguna';
                            addressParts.push(province);
                            
                            // Join all parts with commas and return
                            return addressParts.length > 0 ? addressParts.join(', ') : 'No address provided';
                          })()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                          Issued: {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
                        </Typography>
                      </Box>

                      {/* QR Code */}
                      {qrCodeDataURL && (
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          mt: 2,
                          p: 1,
                          bgcolor: '#f8f9fa',
                          borderRadius: 1,
                          border: '1px solid #ddd'
                        }}>
                          <Typography variant="caption" sx={{ 
                            fontWeight: 'bold', 
                            color: '#333', 
                            mb: 1,
                            fontSize: '0.7rem'
                          }}>
                            QR CODE
                          </Typography>
                          <img 
                            src={qrCodeDataURL} 
                            alt="PWD QR Code" 
                            style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                          />
                          <Typography variant="caption" sx={{ 
                            color: '#666', 
                            mt: 0.5,
                            fontSize: '0.6rem',
                            textAlign: 'center'
                          }}>
                            Scan for benefits
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Footer */}
                  <Box sx={{ 
                    p: 1.5,
                    textAlign: 'center',
                    borderTop: '2px solid #1976d2',
                    bgcolor: '#f8f9fa'
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      color: '#1976d2',
                      fontSize: '0.8rem',
                      letterSpacing: '0.5px'
                    }}>
                      VALID ANYWHERE IN THE PHILIPPINES
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              {/* Account Information */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    p: 3,
                    color: 'white'
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                      ACCOUNT INFORMATION
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'white', fontWeight: 500 }}>
                      Member Account Details
                    </Typography>
                  </Box>
                  
                  <CardContent sx={{ p: 3, bgcolor: '#2C3E50' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                          Account Status
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                          Active
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                          Age
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                          {getAge(formData.birthDate)} years old
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                          Member Since
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                          {profile?.created_at ? formatDate(profile.created_at) : 'Not available'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                          User ID
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                          {profile?.userID || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(true)}
                        sx={{ color: 'white', borderColor: 'white' }}
                        size="small"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<SecurityIcon />}
                        onClick={() => setPasswordDialog(true)}
                        sx={{ color: 'white', borderColor: 'white' }}
                        size="small"
                      >
                        Change Password
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={refreshUserData}
                        sx={{ color: 'white', borderColor: 'white' }}
                        size="small"
                      >
                        Refresh Data
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

        </Grid>

        {/* Change Password Dialog */}
        <Dialog 
          open={passwordDialog} 
          onClose={() => setPasswordDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#2C3E50',
              color: '#FFFFFF'
            }
          }}
        >
          <DialogTitle sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Change Password</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                autoFocus={false}
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
                    color: '#BDC3C7',
                    '&.Mui-focused': {
                      color: '#3498DB',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF',
                  },
                }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                autoFocus={false}
                margin="normal"
                helperText="Password must be at least 6 characters long"
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
                    color: '#BDC3C7',
                    '&.Mui-focused': {
                      color: '#3498DB',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF',
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#BDC3C7',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                autoFocus={false}
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
                    color: '#BDC3C7',
                    '&.Mui-focused': {
                      color: '#3498DB',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF',
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#2C3E50', p: 2 }}>
            <Button 
              onClick={() => setPasswordDialog(false)}
              sx={{ 
                color: '#BDC3C7',
                '&:hover': { bgcolor: 'rgba(189, 195, 199, 0.1)' }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordChange} 
              variant="contained"
              disabled={saving}
              sx={{ 
                bgcolor: '#3498DB',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#2980B9' },
                '&:disabled': { bgcolor: '#7F8C8D' }
              }}
            >
              {saving ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Password Success Popup */}
        <Dialog 
          open={passwordSuccessDialog} 
          onClose={() => setPasswordSuccessDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '2px solid #4CAF50'
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            bgcolor: '#E8F5E8', 
            color: '#2E7D32',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            py: 3
          }}>
            ✅ Password Changed Successfully!
          </DialogTitle>
          <DialogContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ 
              color: '#2E7D32', 
              fontSize: '1.1rem',
              fontWeight: 500,
              mb: 2
            }}>
              Your password has been updated successfully.
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#666', 
              fontSize: '0.95rem'
            }}>
              You can now use your new password to log in to your account.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center', 
            pb: 3,
            bgcolor: '#F8F9FA'
          }}>
            <Button 
              onClick={() => setPasswordSuccessDialog(false)}
              variant="contained"
              sx={{ 
                bgcolor: '#4CAF50',
                color: '#FFFFFF',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { 
                  bgcolor: '#45A049',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                }
              }}
            >
              Got it!
            </Button>
          </DialogActions>
        </Dialog>

        {/* Password Error Popup */}
        <Dialog 
          open={passwordErrorDialog} 
          onClose={() => setPasswordErrorDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '2px solid #F44336'
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            bgcolor: '#FFEBEE', 
            color: '#C62828',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            py: 3
          }}>
            ❌ Password Change Failed
          </DialogTitle>
          <DialogContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ 
              color: '#C62828', 
              fontSize: '1.1rem',
              fontWeight: 500,
              mb: 2
            }}>
              {passwordErrorMessage}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#666', 
              fontSize: '0.95rem'
            }}>
              Please check your information and try again.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center', 
            pb: 3,
            bgcolor: '#F8F9FA'
          }}>
            <Button 
              onClick={() => setPasswordErrorDialog(false)}
              variant="contained"
              sx={{ 
                bgcolor: '#F44336',
                color: '#FFFFFF',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { 
                  bgcolor: '#D32F2F',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                }
              }}
            >
              Try Again
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default PWDProfile;
