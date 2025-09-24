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
const BARANGAYS = [
  { name: 'Banlic', lat: 14.2488, lng: 121.1248, color: '#FF6B35' },
  { name: 'Bigaa', lat: 14.2588, lng: 121.1348, color: '#4CAF50' },
  { name: 'Butong', lat: 14.2388, lng: 121.1148, color: '#2196F3' },
  { name: 'Casile', lat: 14.2688, lng: 121.1448, color: '#FF9800' },
  { name: 'Diezmo', lat: 14.2288, lng: 121.1048, color: '#F44336' },
  { name: 'Gulod', lat: 14.2788, lng: 121.1548, color: '#00BCD4' },
  { name: 'Mamatid', lat: 14.2188, lng: 121.0948, color: '#8BC34A' },
  { name: 'Marinig', lat: 14.2888, lng: 121.1648, color: '#E91E63' },
  { name: 'Niugan', lat: 14.2088, lng: 121.0848, color: '#3F51B5' },
  { name: 'Pittland', lat: 14.2988, lng: 121.1748, color: '#FFC107' },
  { name: 'Pulo', lat: 14.1988, lng: 121.0748, color: '#795548' },
  { name: 'Sala', lat: 14.3088, lng: 121.1848, color: '#607D8B' },
  { name: 'San Isidro', lat: 14.1888, lng: 121.0648, color: '#009688' },
  { name: 'Poblacion Uno', lat: 14.2488, lng: 121.1248, color: '#673AB7' },
  { name: 'Poblacion Dos', lat: 14.2488, lng: 121.1248, color: '#FF5722' },
  { name: 'Poblacion Tres', lat: 14.2488, lng: 121.1248, color: '#CDDC39' },
  { name: 'Poblacion Cuatro', lat: 14.2488, lng: 121.1248, color: '#FFEB3B' },
  { name: 'Poblacion Cinco', lat: 14.2488, lng: 121.1248, color: '#00E676' }
];

const FreeGoogleMapsComponent = ({ onBarangaySelect, height = '400px' }) => {
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [mapType, setMapType] = useState('openstreet'); // 'google' or 'openstreet'

  const handleBarangayClick = (barangay) => {
    console.log('🗺️ Barangay clicked:', barangay.name);
    setSelectedBarangay(barangay);
    if (onBarangaySelect) {
      console.log('🗺️ Calling onBarangaySelect with:', barangay);
      onBarangaySelect(barangay);
    } else {
      console.log('🗺️ No onBarangaySelect callback provided');
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

  // Dynamic map URLs based on selected barangay
  const getMapCenter = () => {
    if (selectedBarangay) {
      return {
        lat: selectedBarangay.lat,
        lng: selectedBarangay.lng,
        name: selectedBarangay.name
      };
    }
    return PWD_OFFICE_LOCATION;
  };

  const mapCenter = getMapCenter();
  
  // Google Maps Embed URL (no API key required - using public embed)
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345!2d${mapCenter.lng}!3d${mapCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDA3JzI0LjQiTiAxMjHCsDA3JzI0LjQiRQ!5e0!3m2!1sen!2sph!4v1234567890123!5m2!1sen!2sph`;

  // OpenStreetMap URL
  const openStreetMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.01},${mapCenter.lat - 0.01},${mapCenter.lng + 0.01},${mapCenter.lat + 0.01}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`;

  return (
    <Box sx={{ width: '100%', height: height, overflow: 'auto' }}>
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
        height: '400px', 
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
            
            {/* Overlay with Selected Location Info */}
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
                  {selectedBarangay ? selectedBarangay.name : 'PWD Office'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#333', fontSize: { xs: '0.7rem', sm: '0.8rem' }, lineHeight: 1.2 }}>
                {selectedBarangay ? `${selectedBarangay.name}, Cabuyao City, Laguna` : PWD_OFFICE_LOCATION.name}
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
            
            {/* Overlay with Selected Location Info */}
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
                  {selectedBarangay ? selectedBarangay.name : 'PWD Office'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#333', fontSize: { xs: '0.7rem', sm: '0.8rem' }, lineHeight: 1.2 }}>
                {selectedBarangay ? `${selectedBarangay.name}, Cabuyao City, Laguna` : PWD_OFFICE_LOCATION.name}
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
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#333', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          Select Barangay
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' },
            gap: { xs: 0.3, sm: 0.4, md: 0.5 },
            minHeight: '200px'
          }}
        >
          {BARANGAYS.map((barangay, index) => {
            const isSelected = selectedBarangay?.name === barangay.name;
            return (
              <Button
                key={index}
                onClick={() => handleBarangayClick(barangay)}
                onDoubleClick={() => openBarangayInMaps(barangay)}
                sx={{
                  backgroundColor: isSelected ? barangay.color : '#fff',
                  color: isSelected ? '#fff' : barangay.color,
                  border: `2px solid ${barangay.color}`,
                  borderRadius: 1,
                  minHeight: { xs: '28px', sm: '30px', md: '32px' },
                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  padding: { xs: '4px 6px', sm: '6px 8px', md: '8px 12px' },
                  boxShadow: isSelected ? `0 2px 8px ${barangay.color}40` : 'none',
                  '&:hover': {
                    backgroundColor: barangay.color,
                    color: '#fff',
                    transform: 'scale(1.05)',
                    boxShadow: `0 4px 12px ${barangay.color}60`
                  },
                  '&:active': {
                    transform: 'scale(0.98)'
                  },
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer'
                }}
              >
                {barangay.name}
              </Button>
            );
          })}
        </Box>
        
        <Typography variant="caption" sx={{ 
          display: 'block', 
          textAlign: 'center', 
          mt: 0.5, 
          color: '#666',
          fontSize: { xs: '0.6rem', sm: '0.7rem' }
        }}>
          Click to select • Double-click to open in Google Maps
        </Typography>
        
        {/* Debug info */}
        {selectedBarangay && (
          <Typography variant="caption" sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 0.5, 
            color: '#4CAF50',
            fontSize: { xs: '0.6rem', sm: '0.7rem' },
            fontWeight: 'bold'
          }}>
            ✓ Selected: {selectedBarangay.name}
          </Typography>
        )}
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
