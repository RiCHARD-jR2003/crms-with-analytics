import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { LocationOn, OpenInNew } from '@mui/icons-material';

// PWD Office Location
const PWD_OFFICE_LOCATION = {
  name: 'PWD Office - Poblacion Uno',
  address: '74JF+3F6, P. Burgos, Publacion Uno, Cabuyao City, 4026 Laguna',
  lat: 14.2488,
  lng: 121.1248
};

// Barangay information
const BARANGAYS = [
  { name: 'Bigaa', color: '#1976d2' },
  { name: 'Butong', color: '#d32f2f' },
  { name: 'Marinig', color: '#388e3c' },
  { name: 'Gulod', color: '#1976d2' },
  { name: 'Pob. Uno', color: '#d32f2f' },
  { name: 'Pob. Dos', color: '#388e3c' },
  { name: 'Pob. Tres', color: '#1976d2' },
  { name: 'Sala', color: '#d32f2f' },
  { name: 'Niugan', color: '#388e3c' },
  { name: 'Banaybanay', color: '#1976d2' },
  { name: 'Pulo', color: '#d32f2f' },
  { name: 'Diezmo', color: '#388e3c' },
  { name: 'Pittland', color: '#1976d2' },
  { name: 'San Isidro', color: '#d32f2f' },
  { name: 'Mamatid', color: '#388e3c' },
  { name: 'Baclaran', color: '#1976d2' },
  { name: 'Casile', color: '#d32f2f' },
  { name: 'Banlic', color: '#388e3c' }
];

const WorkingMapComponent = ({ onBarangaySelect, height = '400px' }) => {
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  const handleBarangayClick = (barangay) => {
    setSelectedBarangay(barangay);
    if (onBarangaySelect) {
      onBarangaySelect(barangay);
    }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PWD_OFFICE_LOCATION.address)}`;
    window.open(url, '_blank');
  };

  console.log('🗺️ WorkingMapComponent is rendering with height:', height);

  return (
    <Box sx={{ width: '100%', height: height, backgroundColor: '#f0f0f0', border: '2px solid #ff0000' }}>
      {/* Debug info */}
      <Box sx={{ 
        backgroundColor: '#e3f2fd', 
        padding: 1, 
        marginBottom: 1, 
        borderRadius: 1,
        fontSize: '0.8rem',
        color: '#1976d2',
        textAlign: 'center'
      }}>
        🗺️ WorkingMapComponent is rendering! Height: {height}
      </Box>

      {/* Map Container */}
      <Box sx={{ 
        height: '70%', 
        position: 'relative', 
        mb: 2,
        backgroundColor: '#e3f2fd',
        borderRadius: 2,
        overflow: 'hidden',
        border: '2px solid #1976d2'
      }}>
        {/* Map Placeholder with PWD Office Info */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: { xs: 1.5, sm: 2, md: 3 },
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: { xs: '90%', sm: '350px', md: '400px' },
            width: { xs: '90%', sm: 'auto' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <LocationOn sx={{ color: '#FF6B35', fontSize: { xs: 24, sm: 28, md: 30 } }} />
            <Typography variant="h5" sx={{ color: '#FF6B35', fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' } }}>
              PWD Office Location
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ color: '#333', mb: 1, fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
            {PWD_OFFICE_LOCATION.name}
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#666', mb: 2, lineHeight: 1.4, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
            {PWD_OFFICE_LOCATION.address}
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#888', mb: 2, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' } }}>
            Coordinates: {PWD_OFFICE_LOCATION.lat}, {PWD_OFFICE_LOCATION.lng}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<OpenInNew />}
            onClick={openInGoogleMaps}
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              padding: { xs: '6px 12px', sm: '7px 14px', md: '8px 16px' },
              fontWeight: 'bold'
            }}
          >
            Open in Google Maps
          </Button>
        </Box>

        {/* Map Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(45deg, #e3f2fd 25%, transparent 25%),
              linear-gradient(-45deg, #e3f2fd 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #e3f2fd 75%),
              linear-gradient(-45deg, transparent 75%, #e3f2fd 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            opacity: 0.3
          }}
        />
      </Box>

      {/* Barangay Selection Grid */}
      <Box sx={{ height: '30%', p: { xs: 0.5, sm: 1 } }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#333', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          Select Barangay
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' },
            gap: { xs: 0.3, sm: 0.4, md: 0.5 },
            height: 'calc(100% - 30px)',
            overflow: 'auto'
          }}
        >
          {BARANGAYS.map((barangay, index) => (
            <Button
              key={index}
              onClick={() => handleBarangayClick(barangay)}
              sx={{
                backgroundColor: selectedBarangay?.name === barangay.name ? barangay.color : '#fff',
                color: selectedBarangay?.name === barangay.name ? '#fff' : barangay.color,
                border: `1px solid ${barangay.color}`,
                borderRadius: 1,
                minHeight: { xs: '28px', sm: '30px', md: '32px' },
                fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                fontWeight: 'bold',
                textTransform: 'none',
                padding: { xs: '4px 6px', sm: '6px 8px', md: '8px 12px' },
                '&:hover': {
                  backgroundColor: barangay.color,
                  color: '#fff',
                  transform: 'scale(1.02)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {barangay.name}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WorkingMapComponent;
