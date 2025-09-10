// src/components/cards/PWDCard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../shared/AdminSidebar';
import pwdMemberService from '../../services/pwdMemberService';

function PWDCard() {
  const { currentUser } = useAuth();
  const [pwdMembers, setPwdMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch PWD members from API
  const fetchPwdMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pwdMemberService.getAll();
      const members = response.data?.members || response.members || [];
      
      // Transform the data to match our expected format
      const transformedMembers = members.map((member, index) => ({
        id: member.pwd_id || `PWD-2025-${String(index + 1).padStart(6, '0')}`,
        name: `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim() || 'Unknown Member',
        age: member.birthDate ? new Date().getFullYear() - new Date(member.birthDate).getFullYear() : 'N/A',
        barangay: member.barangay || 'N/A',
        status: 'Active',
        disabilityType: member.disabilityType || 'Not specified',
        birthDate: member.birthDate,
        firstName: member.firstName,
        lastName: member.lastName,
        middleName: member.middleName,
        suffix: member.suffix,
        address: member.address,
        contactNumber: member.contactNumber || member.phone,
        gender: member.gender || member.sex,
        bloodType: member.bloodType
      }));
      
      // If no members from API, use mock data for demonstration
      if (transformedMembers.length === 0) {
        const mockMembers = [
          {
            id: 'PWD-2025-000001',
            name: 'Juan Dela Cruz Alimagno Jr.',
            age: 56,
            barangay: 'Banaybanay',
            status: 'Active',
            disabilityType: 'Physical Disability',
            birthDate: '1968-05-15',
            firstName: 'Juan',
            lastName: 'Dela Cruz',
            middleName: 'Alimagno',
            suffix: 'Jr.',
            address: '#24 Purok 4, Brgy. Mamatid, City of Cabuyao, Laguna',
            contactNumber: '+63 987 654 3210',
            gender: 'Male',
            bloodType: 'O+'
          },
          {
            id: 'PWD-2025-000002',
            name: 'Maria Santos Garcia',
            age: 42,
            barangay: 'Banlic',
            status: 'Active',
            disabilityType: 'Visual Impairment',
            birthDate: '1982-03-22',
            firstName: 'Maria',
            lastName: 'Santos',
            middleName: 'Garcia',
            suffix: '',
            address: '#15 Purok 2, Brgy. Banlic, City of Cabuyao, Laguna',
            contactNumber: '+63 912 345 6789',
            gender: 'Female',
            bloodType: 'A+'
          },
          {
            id: 'PWD-2025-000003',
            name: 'Pedro Rodriguez Lopez',
            age: 38,
            barangay: 'Bigaa',
            status: 'Active',
            disabilityType: 'Hearing Impairment',
            birthDate: '1986-07-10',
            firstName: 'Pedro',
            lastName: 'Rodriguez',
            middleName: 'Lopez',
            suffix: '',
            address: '#8 Purok 3, Brgy. Bigaa, City of Cabuyao, Laguna',
            contactNumber: '+63 923 456 7890',
            gender: 'Male',
            bloodType: 'B+'
          },
          {
            id: 'PWD-2025-000004',
            name: 'Ana Martinez Cruz',
            age: 29,
            barangay: 'Butong',
            status: 'Active',
            disabilityType: 'Mobility Impairment',
            birthDate: '1995-12-03',
            firstName: 'Ana',
            lastName: 'Martinez',
            middleName: 'Cruz',
            suffix: '',
            address: '#12 Purok 1, Brgy. Butong, City of Cabuyao, Laguna',
            contactNumber: '+63 934 567 8901',
            gender: 'Female',
            bloodType: 'AB+'
          },
          {
            id: 'PWD-2025-000005',
            name: 'Carlos Mendoza Reyes',
            age: 45,
            barangay: 'Casile',
            status: 'Active',
            disabilityType: 'Speech Impairment',
            birthDate: '1979-04-18',
            firstName: 'Carlos',
            lastName: 'Mendoza',
            middleName: 'Reyes',
            suffix: '',
            address: '#6 Purok 5, Brgy. Casile, City of Cabuyao, Laguna',
            contactNumber: '+63 945 678 9012',
            gender: 'Male',
            bloodType: 'O-'
          },
          {
            id: 'PWD-2025-000006',
            name: 'Elena Torres Villanueva',
            age: 33,
            barangay: 'Mamatid',
            status: 'Active',
            disabilityType: 'Intellectual Disability',
            birthDate: '1991-09-25',
            firstName: 'Elena',
            lastName: 'Torres',
            middleName: 'Villanueva',
            suffix: '',
            address: '#20 Purok 2, Brgy. Mamatid, City of Cabuyao, Laguna',
            contactNumber: '+63 956 789 0123',
            gender: 'Female',
            bloodType: 'A-'
          },
          {
            id: 'PWD-2025-000007',
            name: 'Roberto Silva Morales',
            age: 51,
            barangay: 'Pulo',
            status: 'Active',
            disabilityType: 'Physical Disability',
            birthDate: '1973-11-12',
            firstName: 'Roberto',
            lastName: 'Silva',
            middleName: 'Morales',
            suffix: '',
            address: '#14 Purok 4, Brgy. Pulo, City of Cabuyao, Laguna',
            contactNumber: '+63 967 890 1234',
            gender: 'Male',
            bloodType: 'B-'
          },
          {
            id: 'PWD-2025-000008',
            name: 'Carmen Flores Aguilar',
            age: 27,
            barangay: 'Sala',
            status: 'Active',
            disabilityType: 'Visual Impairment',
            birthDate: '1997-02-28',
            firstName: 'Carmen',
            lastName: 'Flores',
            middleName: 'Aguilar',
            suffix: '',
            address: '#18 Purok 3, Brgy. Sala, City of Cabuyao, Laguna',
            contactNumber: '+63 978 901 2345',
            gender: 'Female',
            bloodType: 'AB-'
          }
        ];
        setPwdMembers(mockMembers);
        setSelectedMember(mockMembers[0].id);
      } else {
      setPwdMembers(transformedMembers);
      
      // Set first member as selected if none selected
      if (!selectedMember && transformedMembers.length > 0) {
        setSelectedMember(transformedMembers[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching PWD members:', err);
      setError('Failed to fetch PWD members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load PWD members on component mount
  useEffect(() => {
    fetchPwdMembers();
  }, []);

  // Generate QR code for selected member
  useEffect(() => {
    if (!selectedMember || pwdMembers.length === 0) return;
    
    const generateQRCode = async () => {
      try {
        // Dynamic import for QR code library
        const QRCode = await import('qrcode');
        
        const member = pwdMembers.find(m => m.id === selectedMember);
        if (!member) return;
        
        const memberData = {
          pwd_id: member.id,
          userID: member.id.replace('PWD-2025-', ''),
          firstName: member.firstName || member.name.split(' ')[0],
          lastName: member.lastName || member.name.split(' ').slice(1).join(' '),
          barangay: member.barangay,
          disabilityType: member.disabilityType,
          birthDate: member.birthDate,
          generatedAt: new Date().toISOString()
        };

        const qrDataURL = await QRCode.toDataURL(JSON.stringify(memberData), {
          width: 100,
          height: 100,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M',
          type: 'image/png',
          quality: 0.92,
          rendererOpts: {
            quality: 0.92
          }
        });
        
        setQrCodeDataURL(qrDataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [selectedMember, pwdMembers]);

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download functionality
    console.log('Download PDF clicked');
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    window.print();
  };

  const selectedMemberData = pwdMembers.find(member => member.id === selectedMember) || pwdMembers[0];

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, p: 3, ml: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ color: '#2C3E50', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading PWD members...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, p: 3, ml: '280px' }}>
          <Alert 
            severity="error" 
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={fetchPwdMembers}
                sx={{ fontWeight: 'bold' }}
              >
                Retry
              </Button>
            }
            sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  // Show empty state
  if (!loading && pwdMembers.length === 0) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, p: 3, ml: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CreditCardIcon sx={{ fontSize: 60, color: '#BDC3C7', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No PWD Members Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              No PWD members are available to generate cards for.
            </Typography>
            <Button
              variant="contained"
              onClick={fetchPwdMembers}
              sx={{ 
                bgcolor: '#2C3E50', 
                '&:hover': { bgcolor: '#1B2631' },
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Original Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '280px', // Account for sidebar width
        }}
      >
        <Container maxWidth="xl">
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2C3E50', mb: 1 }}>
              PWD Card
            </Typography>
            <Typography variant="body1" sx={{ color: '#7F8C8D' }}>
              View and manage PWD ID cards for members.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Left Panel - PWD Masterlist */}
            <Grid item xs={12} md={8}>
              <Card elevation={3}>
                <CardContent sx={{ p: 0 }}>
                  {/* Header with tabs and controls */}
                  <Box sx={{ 
                    backgroundColor: '#253D90', 
                    color: 'white', 
                    p: 2, 
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Masterlist
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton sx={{ color: 'white' }} onClick={fetchPwdMembers}>
                        <RefreshIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                          color: 'white',
                          textTransform: 'none'
                        }}
                      >
                        Print List
                      </Button>
                    </Box>
                  </Box>

                  {/* Table Title */}
                  <Box sx={{ 
                    backgroundColor: '#253D90', 
                    color: 'white', 
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      PWD MASTERLIST
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      px: 2, 
                      py: 0.5, 
                      borderRadius: 1 
                    }}>
                      <Typography variant="body2">
                        PWD Members Master List ({pwdMembers.length} records)
                      </Typography>
                    </Box>
                  </Box>

                  {/* Data Table */}
                  <TableContainer 
                    component={Paper} 
                    elevation={0} 
                    sx={{ 
                      border: '1px solid #E0E0E0',
                      height: '400px',
                      overflow: 'auto'
                    }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#253D90' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>PWD ID NO.</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>NAME</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>AGE</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>BARANGAY</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>STATUS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pwdMembers.map((member, index) => (
                          <TableRow 
                            key={member.id}
                            sx={{ 
                              backgroundColor: selectedMember === member.id ? '#E3F2FD' : (index % 2 === 0 ? 'white' : '#F8F9FA'),
                              cursor: 'pointer',
                              borderLeft: selectedMember === member.id ? '4px solid #3498DB' : 'none'
                            }}
                            onClick={() => setSelectedMember(member.id)}
                          >
                            <TableCell sx={{ fontSize: '13px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Radio
                                  checked={selectedMember === member.id}
                                  onChange={() => setSelectedMember(member.id)}
                                  sx={{ color: '#3498DB' }}
                                />
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {member.id}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>{member.name}</TableCell>
                            <TableCell sx={{ fontSize: '13px' }}>{member.age}</TableCell>
                            <TableCell sx={{ fontSize: '13px' }}>{member.barangay}</TableCell>
                            <TableCell>
                              <Chip 
                                label={member.status} 
                                color="success"
                                size="small"
                                sx={{ 
                                  fontWeight: 'bold',
                                  fontSize: '11px',
                                  height: '24px'
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Panel - PWD Card Preview */}
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ height: '50%', backgroundColor: 'transparent', mb: 2 }}>
                <CardContent sx={{ p: 0, height: '100%' }}>
                  <Box sx={{
                    background: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#000000',
                    position: 'relative',
                    borderRadius: 2,
                    border: '2px solid #E0E0E0',
                    p: 2,
                    height: '100%',
                    width: '100%',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}>
                    {/* Left Side - Header and Member Details */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      flex: 1,
                      pr: 2
                  }}>
                    {/* Card Header */}
                      <Box sx={{ textAlign: 'center', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          mb: 0.3, 
                          fontSize: '10px', 
                          color: '#FFFFFF',
                          letterSpacing: '0.3px'
                        }}>
                        REPUBLIC OF THE PHILIPPINES
                      </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          mb: 0.3, 
                          fontSize: '10px', 
                          color: '#FFFFFF',
                          letterSpacing: '0.3px'
                        }}>
                        PROVINCE OF LAGUNA
                      </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          mb: 0.3, 
                          fontSize: '10px', 
                          color: '#FFFFFF',
                          letterSpacing: '0.3px'
                        }}>
                        CITY OF CABUYAO
                      </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          fontSize: '10px', 
                          color: '#FFFFFF',
                          letterSpacing: '0.3px'
                        }}>
                        (P.D.A.O)
                      </Typography>
                    </Box>

                      {/* Logo Section */}
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5
                      }}>
                        <Box sx={{
                          backgroundColor: '#F8F9FA',
                          borderRadius: 0.5,
                          px: 1.5,
                          py: 0.5,
                          border: '1px solid #E0E0E0'
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: '#FFFFFF', 
                            fontSize: '9px', 
                            fontWeight: 'bold',
                            letterSpacing: '0.3px'
                          }}>
                            CABUYAO PDAO
                        </Typography>
                        </Box>
                      </Box>

                      {/* Member Details */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ 
                          mb: 0.5, 
                          fontSize: '9px', 
                          color: '#FFFFFF', 
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}>
                          NAME: {selectedMemberData?.name || 'Unknown Member'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          mb: 0.5, 
                          fontSize: '9px', 
                          color: '#FFFFFF', 
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}>
                          ID No.: {selectedMemberData?.id || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          mb: 0.5, 
                          fontSize: '9px', 
                          color: '#FFFFFF', 
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}>
                          TYPE OF DISABILITY: {selectedMemberData?.disabilityType || 'Not specified'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontSize: '9px', 
                          color: '#FFFFFF', 
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}>
                          SIGNATURE: _________
                        </Typography>
                    </Box>

                      {/* Card Footer */}
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        fontSize: '8px', 
                        color: '#FFFFFF',
                        textAlign: 'center',
                        letterSpacing: '0.3px',
                        textTransform: 'uppercase',
                        mt: 1
                      }}>
                        VALID ANYWHERE IN THE PHILIPPINES
                      </Typography>
                    </Box>

                    {/* Right Side - Photo and QR Code */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      flexShrink: 0
                    }}>
                        {/* Photo Placeholder */}
                        <Box sx={{
                          width: 70,
                          height: 70,
                          backgroundColor: '#F8F9FA',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px dashed #BDC3C7'
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: '#FFFFFF', 
                            textAlign: 'center', 
                            fontSize: '8px',
                            fontWeight: 'bold',
                            letterSpacing: '0.3px'
                          }}>
                            PHOTO
                          </Typography>
                    </Box>

                    {/* QR Code */}
                    {qrCodeDataURL && (
                      <Box sx={{
                        display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          backgroundColor: '#FFFFFF',
                        borderRadius: 1,
                          p: 1,
                          border: '1px solid #E0E0E0'
                      }}>
                        <img 
                          src={qrCodeDataURL} 
                          alt="QR Code" 
                          style={{
                            width: '50px',
                            height: '50px',
                              borderRadius: '2px'
                            }}
                          />
                          <Typography variant="caption" sx={{ 
                            color: '#FFFFFF', 
                            fontSize: '7px',
                            fontWeight: 'bold',
                            mt: 0.5
                          }}>
                            PH
                          </Typography>
                      </Box>
                    )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* PWD Information Section */}
              <Card elevation={0} sx={{ height: '50%', backgroundColor: 'transparent' }}>
                <CardContent sx={{ p: 0, height: '100%' }}>
                  <Box sx={{ 
                    background: '#FFFFFF',
                    borderRadius: 2,
                    border: '2px solid #E0E0E0',
                    p: 2,
                    height: '100%',
                    width: '100%',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        position: 'relative',
                        mr: 2
                      }}>
                        <Avatar sx={{ 
                          width: 40, 
                          height: 40, 
                          backgroundColor: '#3498DB',
                          border: '2px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}>
                          <PersonIcon />
                        </Avatar>
                        <Box sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 16,
                          height: 16,
                          backgroundColor: '#27AE60',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid white'
                        }}>
                          <EditIcon sx={{ fontSize: 8, color: 'white' }} />
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                        PWD Information
                      </Typography>
                    </Box>
                  
                  {selectedMemberData ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FFFFFF', mb: 0.5, fontSize: '12px' }}>
                          Name:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                            {selectedMemberData.lastName || 'Dela Cruz'},
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                            {selectedMemberData.firstName || 'Juan'},
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                            {selectedMemberData.middleName || 'Alimagno'},
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                            {selectedMemberData.suffix || 'Jr.'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FFFFFF', mb: 0.5, fontSize: '12px' }}>
                          Address:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '14px' }}>
                          {selectedMemberData.address || '#24 Purok 4, Brgy. Mamatid, City of Cabuyao, Laguna'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FFFFFF', mb: 0.5, fontSize: '12px' }}>
                            Contact #:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '14px' }}>
                            {selectedMemberData.contactNumber || '+63 987 654 3210'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FFFFFF', mb: 0.5, fontSize: '12px' }}>
                            Sex:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '14px' }}>
                            {selectedMemberData.gender || 'Male'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FFFFFF', mb: 0.5, fontSize: '12px' }}>
                            Blood Type:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '14px' }}>
                            {selectedMemberData.bloodType || 'O+'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      py: 4,
                      flexDirection: 'column'
                    }}>
                      <PersonIcon sx={{ fontSize: 48, color: '#FFFFFF', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: '#FFFFFF', textAlign: 'center' }}>
                        Select a PWD member to view information
                      </Typography>
                    </Box>
                  )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default PWDCard;