# Google Maps Setup Instructions

## What I've Added:

✅ **Google Maps Component**: Created `GoogleMapsComponent.js` with:
- Interactive map of Cabuyao, Laguna
- PWD Office location pinned at: `74JF+3F6, P. Burgos, Publacion Uno, Cabuyao City, 4026 Laguna`
- All 18 barangays marked with colored pins
- Clickable markers with info windows

✅ **AdminDashboard Integration**: Updated the map section to use Google Maps instead of static buttons

## To Complete Setup:

### 1. Get Google Maps API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Update API Key:
In `pwd-frontend/src/components/shared/GoogleMapsComponent.js`, replace:
```javascript
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
```
with your actual API key:
```javascript
const GOOGLE_MAPS_API_KEY = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### 3. Features:
- **PWD Office**: Orange marker with office details
- **Barangays**: Colored markers (blue, red, green) for each barangay
- **Interactive**: Click markers to see info
- **Responsive**: Works on mobile and desktop
- **Selection**: Click barangay markers to select them

### 4. Mobile Testing:
The map will work on your cellphone at `http://192.168.18.25:3000` once you add the API key!

## Current Status:
- ✅ Component created
- ✅ Dashboard integrated  
- ⏳ **Need API key** to see the actual map
- ⏳ **Need to restart React server** after adding API key

Once you get the API key and update it, the map will show the real Google Maps with your PWD office location pinned!


