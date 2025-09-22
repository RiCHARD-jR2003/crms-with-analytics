import React, { useState } from 'react';
import { Box, Typography, Button, Alert, Card, CardContent } from '@mui/material';
import { LocationOn, OpenInNew, Map as MapIcon } from '@mui/icons-material';

// PWD Office Location
const PWD_OFFICE_LOCATION = {
  name: 'PWD Office - Poblacion Uno',
  address: '74JF+3F6, P. Burgos, Publacion Uno, Cabuyao City, 4026 Laguna',
  lat: 14.2488,
  lng: 121.1248
};

// Barangay information with coordinates


const FreeGoogleMapsComponent = ({ onBarangaySelect, height = '400px' }) => {
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [mapType, setMapType] = useState('google'); // 'google' or 'openstreet'

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

  const openBarangayInMaps = (barangay) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(barangay.name + ', Cabuyao City, Laguna')}`;
    window.open(url, '_blank');
  };

  // Google Maps Embed URL (no API key required)
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgGjqJjJjJj&q=${encodeURIComponent(PWD_OFFICE_LOCATION.address)}&zoom=13`;

  // OpenStreetMap URL
  const openStreetMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${PWD_OFFICE_LOCATION.lng - 0.01},${PWD_OFFICE_LOCATION.lat - 0.01},${PWD_OFFICE_LOCATION.lng + 0.01},${PWD_OFFICE_LOCATION.lat + 0.01}&layer=mapnik&marker=${PWD_OFFICE_LOCATION.lat},${PWD_OFFICE_LOCATION.lng}`;

  return (
    <Box sx={{ width: '100%', height: height }}>
      {/* Map Type Selector */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 2, 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Button
          variant={mapType === 'google' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setMapType('google')}
          startIcon={<MapIcon />}
          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
        >
          Google Maps
        </Button>
        <Button
          variant={mapType === 'openstreet' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setMapType('openstreet')}
          startIcon={<MapIcon />}
          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
        >
          OpenStreetMap
        </Button>
      </Box>

      {/* Map Container */}
      <Box sx={{ 
        height: '70%', 
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        border: '2px solid #1976d2',
        position: 'relative'
      }}>
        {mapType === 'google' ? (
          <Box sx={{ position: 'relative', height: '100%' }}>
            {/* Google Maps Embed */}
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - PWD Office Location"
            />
            
            {/* Overlay with PWD Office Info */}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: { xs: 1, sm: 1.5 },
                borderRadius: 1,
                boxShadow: 2,
                maxWidth: { xs: '200px', sm: '250px' },
                zIndex: 1000
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <LocationOn sx={{ color: '#FF6B35', fontSize: { xs: 16, sm: 20 } }} />
                <Typography variant="subtitle2" sx={{ color: '#FF6B35', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  PWD Office
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#333', fontSize: { xs: '0.7rem', sm: '0.8rem' }, lineHeight: 1.2 }}>
                {PWD_OFFICE_LOCATION.name}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ position: 'relative', height: '100%' }}>
            {/* OpenStreetMap Embed */}
            <iframe
              src={openStreetMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="OpenStreetMap - PWD Office Location"
            />
            
            {/* Overlay with PWD Office Info */}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: { xs: 1, sm: 1.5 },
                borderRadius: 1,
                boxShadow: 2,
                maxWidth: { xs: '200px', sm: '250px' },
                zIndex: 1000
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <LocationOn sx={{ color: '#FF6B35', fontSize: { xs: 16, sm: 20 } }} />
                <Typography variant="subtitle2" sx={{ color: '#FF6B35', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  PWD Office
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#333', fontSize: { xs: '0.7rem', sm: '0.8rem' }, lineHeight: 1.2 }}>
                {PWD_OFFICE_LOCATION.name}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            display: 'flex',
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<OpenInNew />}
            onClick={openInGoogleMaps}
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              padding: { xs: '4px 8px', sm: '6px 12px' }
            }}
          >
            Open in Maps
          </Button>
        </Box>
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
              onDoubleClick={() => openBarangayInMaps(barangay)}
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
        
        <Typography variant="caption" sx={{ 
          display: 'block', 
          textAlign: 'center', 
          mt: 0.5, 
          color: '#666',
          fontSize: { xs: '0.6rem', sm: '0.7rem' }
        }}>
          Double-click barangay to open in Google Maps
        </Typography>
      </Box>

      {/* Selected Barangay Info */}
      {selectedBarangay && (
        <Card sx={{ mt: 2, backgroundColor: '#E8F4FD', border: '1px solid #3498DB' }}>
          <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                  Selected: {selectedBarangay.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Coordinates: {selectedBarangay.lat}, {selectedBarangay.lng}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<OpenInNew />}
                onClick={() => openBarangayInMaps(selectedBarangay)}
                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
              >
                View in Maps
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FreeGoogleMapsComponent;
