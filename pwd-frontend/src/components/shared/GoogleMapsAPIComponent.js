import React, { useState, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { LocationOn, OpenInNew } from '@mui/icons-material';

// PWD Office Location
const PWD_OFFICE_LOCATION = {
  name: 'PWD Office - Poblacion Uno',
  address: '74JF+3F6, P. Burgos, Publacion Uno, Cabuyao City, 4026 Laguna',
  lat: 14.2488,
  lng: 121.1248
};

// Barangay information with coordinates
const BARANGAYS = [
  { name: 'Bigaa', color: '#1976d2', lat: 14.2500, lng: 121.1200 },
  { name: 'Butong', color: '#d32f2f', lat: 14.2400, lng: 121.1300 },
  { name: 'Marinig', color: '#388e3c', lat: 14.2600, lng: 121.1100 },
  { name: 'Gulod', color: '#1976d2', lat: 14.2300, lng: 121.1400 },
  { name: 'Pob. Uno', color: '#d32f2f', lat: 14.2488, lng: 121.1248 },
  { name: 'Pob. Dos', color: '#388e3c', lat: 14.2500, lng: 121.1250 },
  { name: 'Pob. Tres', color: '#1976d2', lat: 14.2520, lng: 121.1260 },
  { name: 'Sala', color: '#d32f2f', lat: 14.2400, lng: 121.1200 },
  { name: 'Niugan', color: '#388e3c', lat: 14.2600, lng: 121.1300 },
  { name: 'Banaybanay', color: '#1976d2', lat: 14.2200, lng: 121.1100 },
  { name: 'Pulo', color: '#d32f2f', lat: 14.2700, lng: 121.1400 },
  { name: 'Diezmo', color: '#388e3c', lat: 14.2100, lng: 121.1200 },
  { name: 'Pittland', color: '#1976d2', lat: 14.2800, lng: 121.1100 },
  { name: 'San Isidro', color: '#d32f2f', lat: 14.2000, lng: 121.1300 },
  { name: 'Mamatid', color: '#388e3c', lat: 14.2900, lng: 121.1200 },
  { name: 'Baclaran', color: '#1976d2', lat: 14.1900, lng: 121.1400 },
  { name: 'Casile', color: '#d32f2f', lat: 14.3000, lng: 121.1300 },
  { name: 'Banlic', color: '#388e3c', lat: 14.1800, lng: 121.1100 }
];

// Google Maps API Key - You need to replace this with your actual API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          gap: 2
        }}>
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            Loading Google Maps...
          </Typography>
        </Box>
      );
    case Status.FAILURE:
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          gap: 2,
          p: 2
        }}>
          <Alert severity="error" sx={{ width: '100%', maxWidth: '400px' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Google Maps Failed to Load
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Please check your API key and internet connection.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{ mt: 1 }}
            >
              Retry
            </Button>
          </Alert>
        </Box>
      );
    default:
      return null;
  }
};

const MapComponent = ({ onBarangaySelect, height = '400px' }) => {
  const [map, setMap] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [markers, setMarkers] = useState([]);

  const onLoad = useCallback((map) => {
    setMap(map);
    
    // Add PWD Office marker
    const pwdOfficeMarker = new google.maps.Marker({
      position: { lat: PWD_OFFICE_LOCATION.lat, lng: PWD_OFFICE_LOCATION.lng },
      map: map,
      title: PWD_OFFICE_LOCATION.name,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#FF6B35" stroke="#fff" stroke-width="2"/>
            <path d="M20 8 L28 20 L20 32 L12 20 Z" fill="#fff"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      }
    });

    // Add info window for PWD Office
    const pwdInfoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; color: #FF6B35; font-size: 16px;">${PWD_OFFICE_LOCATION.name}</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${PWD_OFFICE_LOCATION.address}</p>
          <p style="margin: 0; color: #888; font-size: 12px;">Coordinates: ${PWD_OFFICE_LOCATION.lat}, ${PWD_OFFICE_LOCATION.lng}</p>
        </div>
      `
    });

    pwdOfficeMarker.addListener('click', () => {
      pwdInfoWindow.open(map, pwdOfficeMarker);
    });

    // Add barangay markers
    const barangayMarkers = BARANGAYS.map((barangay) => {
      const marker = new google.maps.Marker({
        position: { lat: barangay.lat, lng: barangay.lng },
        map: map,
        title: barangay.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="12" fill="${barangay.color}" stroke="#fff" stroke-width="2"/>
              <text x="15" y="20" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">${barangay.name.charAt(0)}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 30),
          anchor: new google.maps.Point(15, 15)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h4 style="margin: 0 0 4px 0; color: ${barangay.color}; font-size: 14px;">${barangay.name}</h4>
            <p style="margin: 0; color: #666; font-size: 12px;">Barangay in Cabuyao City</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        setSelectedBarangay(barangay);
        if (onBarangaySelect) {
          onBarangaySelect(barangay);
        }
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers([pwdOfficeMarker, ...barangayMarkers]);
  }, [onBarangaySelect]);

  const handleBarangayClick = (barangay) => {
    setSelectedBarangay(barangay);
    if (onBarangaySelect) {
      onBarangaySelect(barangay);
    }
    
    // Pan to barangay location
    if (map) {
      map.panTo({ lat: barangay.lat, lng: barangay.lng });
      map.setZoom(15);
    }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PWD_OFFICE_LOCATION.address)}`;
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ width: '100%', height: height }}>
      {/* Map Container */}
      <Box sx={{ 
        height: '70%', 
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        border: '2px solid #1976d2'
      }}>
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
          <Map
            center={{ lat: PWD_OFFICE_LOCATION.lat, lng: PWD_OFFICE_LOCATION.lng }}
            zoom={13}
            onLoad={onLoad}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              zoomControl: true,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            }}
          />
        </Wrapper>
      </Box>

      {/* Barangay Selection Grid */}
      <Box sx={{ height: '30%', p: { xs: 0.5, sm: 1 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#333', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Select Barangay
          </Typography>
          <Button
            variant="outlined"
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
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' },
            gap: { xs: 0.3, sm: 0.4, md: 0.5 },
            height: 'calc(100% - 40px)',
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

// Map component that will be rendered by the Wrapper
const Map = ({ onLoad, ...options }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current && !window.map) {
      window.map = new window.google.maps.Map(ref.current, options);
      onLoad(window.map);
    }
  }, [ref, onLoad, options]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

const GoogleMapsAPIComponent = ({ onBarangaySelect, height = '400px' }) => {
  return (
    <Box sx={{ width: '100%', height: height }}>
      {GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          gap: 2,
          p: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 2
        }}>
          <Alert severity="warning" sx={{ width: '100%', maxWidth: '500px' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Google Maps API Key Required
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              To display the interactive map, you need to:
            </Typography>
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Get a Google Maps API key from Google Cloud Console
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Replace 'YOUR_GOOGLE_MAPS_API_KEY_HERE' in the code
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 2 }}>
                Enable Maps JavaScript API in your Google Cloud project
              </Typography>
            </Box>
            <Button
              variant="contained"
              href="https://console.cloud.google.com/"
              target="_blank"
              sx={{ mt: 1 }}
            >
              Get API Key
            </Button>
          </Alert>
        </Box>
      ) : (
        <MapComponent onBarangaySelect={onBarangaySelect} height={height} />
      )}
    </Box>
  );
};

export default GoogleMapsAPIComponent;
