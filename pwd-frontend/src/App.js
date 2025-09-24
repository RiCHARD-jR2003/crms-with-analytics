// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/Landing/LandingPage';
import Login from './components/auth/login';
import Register from './components/auth/Register';
import PasswordReset from './components/auth/PasswordReset';
import PWDMemberDashboard from './components/dashboard/PWDMemberDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import BarangayPresidentDashboard from './components/dashboard/BarangayPresidentDashboard';
import PWDProfile from './components/profile/PWDProfile';
import PWDMemberSupportDesk from './components/support/PWDMemberSupportDesk';
import AdminSupportDesk from './components/support/AdminSupportDesk';
import PWDMemberAnnouncement from './components/announcement/PWDMemberAnnouncement';
import PWDRecords from './components/records/PWDRecords';
import Reports from './components/reports/Reports';
import BarangayPresidentPWDRecords from './components/records/BarangayPresidentPWDRecords';
import BarangayPresidentPWDCard from './components/cards/BarangayPresidentPWDCard';
import BarangayPresidentReports from './components/reports/BarangayPresidentReports';
import BarangayPresidentAyuda from './components/ayuda/BarangayPresidentAyuda';
import BarangayPresidentAnnouncement from './components/announcement/BarangayPresidentAnnouncement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
      dark: '#1B2631',
      light: '#34495E',
    },
    secondary: {
      main: '#4CAF50',
      light: '#66BB6A',
      dark: '#388E3C',
    },
    background: {
      default: '#FFFFFF',
      paper: '#2C3E50',
    },
    text: {
      primary: '#000000',
      secondary: '#2C3E50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
        },
      },
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={currentUser ? <Navigate to="/dashboard" /> : <Register />} 
      />
      <Route 
        path="/password-reset" 
        element={currentUser ? <Navigate to="/dashboard" /> : <PasswordReset />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {currentUser?.role === 'PWDMember' && <PWDMemberDashboard />}
            {currentUser?.role === 'Admin' && <AdminDashboard />}
            {currentUser?.role === 'BarangayPresident' && <BarangayPresidentDashboard />}
          </ProtectedRoute>
        } 
      />
      {/* Admin Routes */}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/pwd-records" 
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <PWDRecords />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin-support" 
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminSupportDesk />
          </ProtectedRoute>
        }
      />
      {/* PWD Member Routes */}
      <Route 
        path="/pwd-dashboard" 
        element={
          <ProtectedRoute allowedRoles={["PWDMember"]}>
            <PWDMemberDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/pwd-announcements" 
        element={
          <ProtectedRoute allowedRoles={["PWDMember"]}>
            <PWDMemberAnnouncement />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/pwd-profile" 
        element={
          <ProtectedRoute allowedRoles={["PWDMember"]}>
            <PWDProfile />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/pwd-support" 
        element={
          <ProtectedRoute allowedRoles={["PWDMember"]}>
            <PWDMemberSupportDesk />
          </ProtectedRoute>
        }
      />
      {/* Barangay President Routes */}
      <Route 
        path="/barangay-president-dashboard" 
        element={
          <ProtectedRoute allowedRoles={["BarangayPresident"]}>
            <BarangayPresidentDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/barangay-president-pwd-records" 
        element={
          <ProtectedRoute allowedRoles={["BarangayPresident"]}>
            <BarangayPresidentPWDRecords />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/barangay-president-pwd-card" 
        element={
          <ProtectedRoute allowedRoles={["BarangayPresident"]}>
            <BarangayPresidentPWDCard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/barangay-president-reports" 
        element={
          <ProtectedRoute allowedRoles={["BarangayPresident"]}>
            <BarangayPresidentReports />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/barangay-president-ayuda" 
        element={
          <ProtectedRoute allowedRoles={["BarangayPresident"]}>
            <BarangayPresidentAyuda />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/barangay-president-announcement" 
        element={
          <ProtectedRoute allowedRoles={["BarangayPresident"]}>
            <BarangayPresidentAnnouncement />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<div>Unauthorized access</div>} />
      <Route path="/apply" element={<div>Apply for PWD membership — Coming soon</div>} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;