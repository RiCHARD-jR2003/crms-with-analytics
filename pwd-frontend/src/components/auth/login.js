// src/components/auth/login.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      console.log('Login form submitted with:', formData);
      const user = await login(formData);
      console.log('Login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setServerError(error.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#2C3E50',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#253D90',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#BDC3C7', mr: 2 }}>
            LOGIN PAGE
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              border: '4px solid #E74C3C',
              position: 'relative',
            }}
          >
            {/* Wheelchair Icon */}
            <Box
              sx={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#253D90',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              ♿
            </Box>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: -8,
                color: '#E74C3C',
                fontWeight: 'bold',
                fontSize: '10px',
                backgroundColor: 'white',
                px: 1,
                borderRadius: 1,
              }}
            >
              PDAO
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            CABUYAO PDAO RMS
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ color: 'white' }}>
          Login
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={0} sx={{ minHeight: '70vh' }}>
            {/* Left Side - Empty Content Area */}
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  height: '100%',
                  backgroundColor: 'white',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#253D90', fontWeight: 'bold', mb: 2 }}>
                    Welcome to PDAO
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#7F8C8D', mb: 4 }}>
                    Cabuyao City
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#95A5A6', maxWidth: 400 }}>
                    Persons with Disabilities Affairs Office - Cabuyao City
                    <br />
                    Empowering lives through inclusive services and support.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Login Panel */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  height: '100%',
                  backgroundColor: '#34495E',
                  borderRadius: 2,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {/* PDAO Office Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    PDAO Office
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                    Cabuyao
                  </Typography>

                  {/* Large Logo */}
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      border: '6px solid #E74C3C',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#253D90',
                        fontSize: '40px',
                        fontWeight: 'bold',
                      }}
                    >
                      ♿
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: -12,
                        color: '#E74C3C',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        backgroundColor: 'white',
                        px: 2,
                        borderRadius: 1,
                      }}
                    >
                      PDAO
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>
                    LUNGSOD NG CABUYAO
                  </Typography>
                </Box>

                {/* Login Form */}
                <Box component="form" onSubmit={handleSubmit}>
                  {serverError && (
                    <Alert severity="error" sx={{ mb: 3, backgroundColor: '#E74C3C', color: 'white' }}>
                      {serverError}
                    </Alert>
                  )}

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      Username
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange('username')}
                      error={!!errors.username}
                      helperText={errors.username}
                      autoComplete="username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& fieldset': {
                            borderColor: 'white',
                          },
                          '&:hover fieldset': {
                            borderColor: '#BDC3C7',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#253D90',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#2C3E50',
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      error={!!errors.password}
                      helperText={errors.password}
                      autoComplete="current-password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& fieldset': {
                            borderColor: 'white',
                          },
                          '&:hover fieldset': {
                            borderColor: '#BDC3C7',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#253D90',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#2C3E50',
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Button
                      variant="text"
                      onClick={() => navigate('/password-reset')}
                      sx={{ color: 'white', fontSize: '12px' }}
                    >
                      Forgot Password
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={submitting}
                      sx={{
                        backgroundColor: '#27AE60',
                        color: 'white',
                        py: 1.5,
                        borderRadius: 1,
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#229954',
                        },
                        '&:disabled': {
                          backgroundColor: '#95A5A6',
                        },
                      }}
                    >
                      {submitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Login'
                      )}
                    </Button>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        backgroundColor: '#27AE60',
                        color: 'white',
                        py: 1.5,
                        borderRadius: 1,
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#229954',
                        },
                      }}
                    >
                      User Login
                    </Button>
                  </Box>

                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                      variant="text"
                      onClick={() => navigate('/register')}
                      sx={{ color: '#BDC3C7', fontSize: '12px' }}
                    >
                      Don't have an account? Register
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Login;