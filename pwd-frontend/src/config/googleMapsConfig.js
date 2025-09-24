// Google Maps Configuration
// To get a Google Maps API key:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable "Maps JavaScript API" and "Maps Embed API"
// 4. Create credentials (API Key)
// 5. Restrict the API key to your domain for security
// 6. Replace 'YOUR_GOOGLE_MAPS_API_KEY' below with your actual API key

export const GOOGLE_MAPS_CONFIG = {
  // Replace this with your actual Google Maps API key
  API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
  
  // Default location (PWD Office in Cabuyao)
  DEFAULT_LOCATION: {
    lat: 14.2488,
    lng: 121.1248,
    name: 'PWD Office - Poblacion Uno',
    address: '74JF+3F6, P. Burgos, Publacion Uno, Cabuyao City, 4026 Laguna'
  },
  
  // Map settings
  DEFAULT_ZOOM: 13,
  MAP_TYPE: 'roadmap'
};

// Check if API key is configured
export const isApiKeyConfigured = () => {
  return GOOGLE_MAPS_CONFIG.API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' && 
         GOOGLE_MAPS_CONFIG.API_KEY.length > 0;
};

// Generate Google Maps embed URL
export const generateMapsEmbedUrl = (lat, lng, zoom = GOOGLE_MAPS_CONFIG.DEFAULT_ZOOM) => {
  if (isApiKeyConfigured()) {
    // Use Google Maps Embed API with API key
    return `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_CONFIG.API_KEY}&center=${lat},${lng}&zoom=${zoom}&maptype=${GOOGLE_MAPS_CONFIG.MAP_TYPE}`;
  } else {
    // Use public Google Maps embed (no API key required)
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;
  }
};

// Generate Google Maps search URL
export const generateMapsSearchUrl = (query) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};
