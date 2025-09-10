import React from 'react';
import { Box, Typography, Paper, Grid, Button, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BarangayPresidentSidebar from '../shared/BarangayPresidentSidebar';
import { useAuth } from '../../contexts/AuthContext';

function BarangayPresidentAyuda() {
  const { currentUser } = useAuth();
  const barangay = currentUser?.barangay || 'Barangay Poblacion';

  const BenefitCard = ({ title, description, icon, color = '#3498DB', status = 'Available' }) => (
    <Paper elevation={0} sx={{
      p: 3,
      border: '1px solid #E0E0E0',
      borderRadius: 2,
      bgcolor: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderColor: color
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}15`
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '1.1rem' }}>
            {title}
          </Typography>
          <Chip 
            label={status} 
            size="small" 
            sx={{ 
              bgcolor: status === 'Available' ? '#27AE60' : '#E74C3C',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 600
            }} 
          />
        </Box>
      </Box>
      <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem', mb: 2, flex: 1 }}>
        {description}
      </Typography>
      <Button
        variant="contained"
        sx={{
          bgcolor: color,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            bgcolor: color,
            opacity: 0.9
          }
        }}
      >
        Apply for Benefit
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F7FC' }}>
      <BarangayPresidentSidebar />
      
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
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '2rem', color: '#2C3E50', mb: 1 }}>
            Ayuda & Benefits - {barangay}
          </Typography>
          <Typography sx={{ color: '#7F8C8D', fontSize: '1rem' }}>
            Manage and distribute benefits to PWD members in {barangay}
          </Typography>
        </Box>

        {/* Benefits Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard
              title="Medical Assistance"
              description={`Financial assistance for medical expenses, treatments, and medications for PWD members in ${barangay}.`}
              icon={<LocalHospitalIcon />}
              color="#E74C3C"
              status="Available"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard
              title="Educational Support"
              description={`Scholarships, school supplies, and educational assistance for PWD students in ${barangay}.`}
              icon={<SchoolIcon />}
              color="#3498DB"
              status="Available"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard
              title="Livelihood Programs"
              description={`Skills training, job placement, and business startup assistance for PWD members in ${barangay}.`}
              icon={<WorkIcon />}
              color="#27AE60"
              status="Available"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard
              title="Transportation Allowance"
              description={`Monthly transportation allowance for PWD members in ${barangay} to help with mobility needs.`}
              icon={<FavoriteIcon />}
              color="#F39C12"
              status="Available"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard
              title="Assistive Devices"
              description={`Wheelchairs, hearing aids, and other assistive devices for PWD members in ${barangay}.`}
              icon={<FavoriteIcon />}
              color="#9B59B6"
              status="Limited"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard
              title="Emergency Relief"
              description={`Emergency financial assistance for PWD members in ${barangay} during disasters or crises.`}
              icon={<FavoriteIcon />}
              color="#1ABC9C"
              status="Available"
            />
          </Grid>
        </Grid>

        {/* Statistics */}
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '1.3rem', mb: 2 }}>
            Benefit Distribution Statistics - {barangay}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{
                p: 2,
                border: '1px solid #E0E0E0',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
                textAlign: 'center'
              }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#27AE60' }}>89</Typography>
                <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Benefits Distributed</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{
                p: 2,
                border: '1px solid #E0E0E0',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
                textAlign: 'center'
              }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#F39C12' }}>23</Typography>
                <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Pending Applications</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{
                p: 2,
                border: '1px solid #E0E0E0',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
                textAlign: 'center'
              }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#3498DB' }}>₱45,000</Typography>
                <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Total Amount Distributed</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{
                p: 2,
                border: '1px solid #E0E0E0',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
                textAlign: 'center'
              }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#E74C3C' }}>12</Typography>
                <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem' }}>This Month</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default BarangayPresidentAyuda;
