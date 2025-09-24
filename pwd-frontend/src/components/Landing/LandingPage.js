// src/components/Landing/LandingPage.js
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function LandingPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/register');
  };

  const handleLoginClick = async () => {
    // Clear any existing authentication data to ensure clean login
    if (currentUser) {
      await logout();
    }
    navigate('/login');
  };

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser && (currentUser.role === 'PWDMember' || currentUser.role === 'BarangayPresident' || currentUser.role === 'Admin')) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // If user is logged in, don't render the landing page
  if (currentUser && (currentUser.role === 'PWDMember' || currentUser.role === 'BarangayPresident' || currentUser.role === 'Admin')) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#253D90',
          color: 'white',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              border: '3px solid #E74C3C',
            }}
          >
            <Typography variant="h6" sx={{ color: '#1B2631', fontWeight: 'bold' }}>
              PWD
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            PDAO
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          CABUYAO PDAO RMS
        </Typography>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1B2631' }}>
            PDAO Management System
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', lineHeight: 1.6, mb: 4 }}>
            Empowering Persons with Disabilities through comprehensive support and services. 
            Access benefits, track applications, and manage your PWD identification.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={handleApplyClick}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#45a049' },
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
          >
            Apply for PWD ID
          </Button>
        </Box>

        {/* PDAO Office Section */}
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#1B2631' }}>
              PDAO Office
            </Typography>
            <Typography variant="h5" sx={{ color: '#666', mb: 3 }}>
              Cabuyao
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#253D90',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  boxShadow: 3,
                }}
              >
                <Typography sx={{ fontSize: 30, color: 'white', mb: 0.5 }}>
                  ♿
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                  PDAO
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleLoginClick}
              sx={{
                backgroundColor: '#253D90',
                '&:hover': { backgroundColor: '#1E2A73' },
                px: 5,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LandingPage;