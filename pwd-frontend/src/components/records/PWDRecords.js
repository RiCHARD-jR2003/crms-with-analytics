  import React, { useMemo, useState, useEffect } from 'react';
  import { 
    Box, 
    Typography, 
    Paper, 
    Tabs, 
    Tab, 
    TextField, 
    InputAdornment, 
    IconButton, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    Grid, 
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Collapse,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Card,
    CardContent
  } from '@mui/material';
  import SearchIcon from '@mui/icons-material/Search';
  import PrintIcon from '@mui/icons-material/Print';
  import FilterListIcon from '@mui/icons-material/FilterList';
  import ClearIcon from '@mui/icons-material/Clear';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import CloseIcon from '@mui/icons-material/Close';
  import AdminSidebar from '../shared/AdminSidebar';
  import { applicationService } from '../../services/applicationService';
  import pwdMemberService from '../../services/pwdMemberService';
  import { api } from '../../services/api';
  import { useAuth } from '../../contexts/AuthContext';
  import { 
    mainContainerStyles, 
    contentAreaStyles, 
    headerStyles, 
    titleStyles, 
    cardStyles,
    dialogStyles,
    dialogTitleStyles,
    dialogContentStyles,
    dialogActionsStyles,
    buttonStyles,
    textFieldStyles,
    tableStyles
  } from '../../utils/themeStyles';

  function PWDRecords() {
    const { currentUser } = useAuth();
    const [tab, setTab] = React.useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      search: '',
      barangay: '',
      disability: '',
      ageRange: '',
      status: ''
    });
    const [applications, setApplications] = useState([]);
    const [pwdMembers, setPwdMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    // Sample data for dropdowns
    const barangays = [
      'Bigaa', 'Butong', 'Marinig', 'Gulod', 'Pob. Uno', 'Pob. Dos', 'Pob. Tres',
      'Sala', 'Niugan', 'Banaybanay', 'Pulo', 'Diezmo', 'Pittland', 'San Isidro',
      'Mamatid', 'Baclaran', 'Casile', 'Banlic'
    ];

    const disabilityTypes = [
      'Visual Impairment', 'Hearing Impairment', 'Physical Disability',
      'Intellectual Disability', 'Learning Disability', 'Mental Health',
      'Speech Impairment', 'Multiple Disabilities', 'Other'
    ];

    const ageRanges = [
      'Under 18', '18-25', '26-35', '36-45', '46-55', '56-65', 'Over 65'
    ];

    const statuses = [
      'Active', 'Inactive', 'Pending', 'Suspended'
    ];

    // Fetch applications and PWD members from database
    useEffect(() => {
      const fetchData = async () => {
        // Only fetch data if user is authenticated
        if (!currentUser) {
          console.log('User not authenticated, skipping data fetch');
          return;
        }

        setLoading(true);
        setError(null);
        try {
          // Fetch applications pending admin approval using applicationService
          const applicationsData = await applicationService.getByStatus('Pending Admin Approval');
          setApplications(applicationsData);
          
          // Also fetch all applications to get complete data for PWD members
          const allApplicationsResponse = await api.get('/applications');
          const allApplications = allApplicationsResponse || [];
          
          // Fetch PWD members using pwdMemberService
          const pwdResponse = await pwdMemberService.getAll();
          const members = pwdResponse.data?.members || pwdResponse.members || [];
          
          // Enhance PWD members with application data
          const enhancedMembers = members.map(member => {
            // Find the corresponding application by email
            const correspondingApp = allApplications.find(app => 
              app.email && member.email && app.email === member.email
            );
            
            return {
              ...member,
              barangay: correspondingApp?.barangay || member.barangay,
              disabilityType: member.disabilityType || correspondingApp?.disabilityType,
              emergencyContact: member.emergencyContact || correspondingApp?.emergencyContact,
              contactNumber: member.contactNumber || correspondingApp?.contactNumber,
              email: member.email || correspondingApp?.email
            };
          });
          
          setPwdMembers(enhancedMembers);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to fetch data');
          setApplications([]);
          setPwdMembers([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [currentUser]);

    const handleApproveApplication = async (applicationId) => {
      try {
        await applicationService.updateStatus(applicationId, {
          status: 'Approved',
          remarks: 'Approved by Admin'
        });

        // Refresh the applications list
        const data = await applicationService.getByStatus('Pending Admin Approval');
        setApplications(data);
        alert('Application approved successfully! PWD Member created.');
      } catch (err) {
        console.error('Error approving application:', err);
        alert('Failed to approve application: ' + (err.message || 'Unknown error'));
      }
    };

    const handleRejectApplication = async (applicationId) => {
      const remarks = prompt('Please provide a reason for rejection:');
      if (!remarks) return;

      try {
        await applicationService.updateStatus(applicationId, {
          status: 'Rejected',
          remarks: remarks
        });

        // Refresh the applications list
        const data = await applicationService.getByStatus('Pending Admin Approval');
        setApplications(data);
        alert('Application rejected successfully!');
      } catch (err) {
        console.error('Error rejecting application:', err);
        alert('Failed to reject application: ' + (err.message || 'Unknown error'));
      }
    };

    const handleViewDetails = (application) => {
      setSelectedApplication(application);
      setViewDetailsOpen(true);
    };

    const handleCloseDetails = () => {
      setViewDetailsOpen(false);
      setSelectedApplication(null);
    };

    const handlePrintApplication = () => {
      const printWindow = window.open('', '_blank');
      const printContent = document.getElementById('application-details');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>PWD Application Details</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .field { margin-bottom: 10px; }
              .label { font-weight: bold; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>CABUYAO PDAO RMS</h1>
              <h2>PWD Application Details</h2>
              <p>Application ID: ${selectedApplication?.applicationID}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
    };

    // Helper function to calculate age from birth date
    const getAgeFromBirthDate = (birthDate) => {
      if (!birthDate) return 'N/A';
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };

    // Transform PWD members data for display
    const rows = useMemo(() => {
      return pwdMembers.map((member, index) => ({
        id: member.id,
        pwdId: `PWD-${member.userID}`,
        name: `${member.firstName} ${member.lastName}`,
        age: getAgeFromBirthDate(member.birthDate),
        barangay: member.barangay || 'Not specified',
        disability: member.disabilityType || 'Not specified',
        guardian: member.emergencyContact || 'Not provided',
        contact: member.contactNumber || 'Not provided',
        status: 'Active' // Default status since it's not in the API response
      }));
    }, [pwdMembers]);

    // Filter the rows based on current filters
    const filteredRows = useMemo(() => {
      // Use different data based on selected tab
      const dataToFilter = tab === 0 ? rows : applications;
      
      // If no filters are active, return all data
      const hasAnyFilters = Object.values(filters).some(value => value !== '');
      if (!hasAnyFilters) {
        return dataToFilter;
      }
      
      const filtered = dataToFilter.filter(row => {
        // Search filter
        const matchesSearch = !filters.search || 
          (row.name && row.name.toLowerCase().includes(filters.search.toLowerCase())) ||
          (row.pwdId && row.pwdId.toLowerCase().includes(filters.search.toLowerCase())) ||
          (row.guardian && row.guardian.toLowerCase().includes(filters.search.toLowerCase())) ||
          (row.contact && row.contact.toLowerCase().includes(filters.search.toLowerCase())) ||
          (row.firstName && `${row.firstName} ${row.lastName}`.toLowerCase().includes(filters.search.toLowerCase())) ||
          (row.email && row.email.toLowerCase().includes(filters.search.toLowerCase()));

        // Barangay filter
        const matchesBarangay = !filters.barangay || 
          (row.barangay && row.barangay === filters.barangay) ||
          (row.address && row.address.toLowerCase().includes(filters.barangay.toLowerCase())) ||
          (row.barangay === 'Not specified' && filters.barangay === 'Not specified');
        
              // Disability filter - handle both masterlist and application data
        let matchesDisability = true;
        if (filters.disability) {
          if (tab === 0) {
            // Masterlist data
            matchesDisability = row.disability && row.disability === filters.disability;
          } else {
            // Application data - handle case sensitivity and partial matches
            const rowDisability = row.disabilityType ? row.disabilityType.toLowerCase() : '';
            const filterDisability = filters.disability.toLowerCase();
            
            // For "Visual Impairment" filter, match "Visual" in database
            // For "Physical Disability" filter, match "Physical" or "physical" in database
            if (filterDisability.includes('visual')) {
              matchesDisability = rowDisability.includes('visual');
            } else if (filterDisability.includes('physical')) {
              matchesDisability = rowDisability.includes('physical');
            } else {
              // For other disabilities, check for exact match or partial match
              matchesDisability = rowDisability === filterDisability || 
                                  rowDisability.includes(filterDisability) ||
                                  filterDisability.includes(rowDisability);
            }
            
            console.log(`Disability check: "${rowDisability}" vs "${filterDisability}" = ${matchesDisability}`);
          }
        }
        
        // Status filter
        const matchesStatus = !filters.status || 
          (row.status && row.status === filters.status) ||
          (row.applicationStatus && row.applicationStatus === filters.status);

        // Age range filter (only for masterlist data)
        let matchesAgeRange = true;
        if (filters.ageRange && row.age) {
          const [min, max] = filters.ageRange.split('-').map(Number);
          if (filters.ageRange === 'Under 18') {
            matchesAgeRange = row.age < 18;
          } else if (filters.ageRange === 'Over 65') {
            matchesAgeRange = row.age > 65;
          } else {
            matchesAgeRange = row.age >= min && row.age <= max;
          }
        }

        return matchesSearch && matchesBarangay && matchesDisability && matchesAgeRange && matchesStatus;
      });
      
      return filtered;
    }, [rows, applications, filters, tab]);

    const handleFilterChange = (field, value) => {
      setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
      setFilters({
        search: '',
        barangay: '',
        disability: '',
        ageRange: '',
        status: ''
      });
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    // Check if user is authenticated and is an admin
    if (!currentUser) {
      return (
        <Box sx={{ ...mainContainerStyles, bgcolor: 'white', p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#E74C3C' }}>
            Please log in to access this page.
          </Typography>
        </Box>
      );
    }

    if (currentUser.role !== 'Admin') {
      return (
        <Box sx={{ ...mainContainerStyles, bgcolor: 'white', p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#E74C3C' }}>
            Access denied. Admin privileges required.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ ...mainContainerStyles, bgcolor: 'white' }}>
        <AdminSidebar />

        {/* Main content */}
        <Box sx={{ ...contentAreaStyles, bgcolor: 'white' }}>
          <Box sx={{ p: 4, m: 2 }}>
            <Paper sx={{ ...cardStyles, p: 3, bgcolor: 'white' }}>
              {/* Header */}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: '#0b87ac',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  PWD Member Records
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#7F8C8D',
                  fontWeight: 500
                }}>
                  Manage and track PWD member information and applications
                </Typography>
              </Box>

              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Tabs 
                    value={tab} 
                    onChange={(_, v) => setTab(v)} 
                    sx={{ 
                      minHeight: 40,
                      '& .MuiTab-root': {
                        color: '#0b87ac',
                        fontWeight: 600,
                        textTransform: 'none',
                        bgcolor: 'transparent',
                        borderRadius: '8px 8px 0 0',
                        mx: 0.5,
                        px: 3,
                        border: '1px solid #E0E0E0',
                        '&:hover': {
                          bgcolor: '#F8FAFC',
                          color: '#0b87ac'
                        },
                        '&.Mui-selected': {
                          color: '#FFFFFF !important',
                          fontWeight: 700,
                          bgcolor: '#0b87ac !important',
                          border: '1px solid #0b87ac'
                        }
                      },
                      '& .MuiTabs-indicator': {
                        display: 'none'
                      }
                    }}
                  >
                    <Tab label="Masterlist" />
                    <Tab label="Pending Application" />
                  </Tabs>
                </Grid>
                <Grid item>
                  <Button 
                    startIcon={<PrintIcon />} 
                    variant="outlined" 
                    sx={{ 
                      textTransform: 'none',
                      color: '#FFFFFF',
                      bgcolor: '#0b87ac',
                      borderColor: '#0b87ac',
                      '&:hover': {
                        borderColor: '#0a6b8a',
                        bgcolor: '#0a6b8a',
                        color: '#FFFFFF'
                      }
                    }}
                  >
                    Print List
                  </Button>
                </Grid>
                <Grid item>
                  <Button 
                    startIcon={<FilterListIcon />} 
                    variant={showFilters ? "contained" : "outlined"}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ 
                      textTransform: 'none',
                      bgcolor: showFilters ? '#27AE60' : '#FFFFFF',
                      color: showFilters ? '#FFFFFF' : '#0b87ac',
                      borderColor: '#0b87ac',
                      '&:hover': {
                        bgcolor: showFilters ? '#229954' : '#F8FAFC',
                        borderColor: '#0b87ac',
                        color: showFilters ? '#FFFFFF' : '#0b87ac'
                      }
                    }}
                  >
                    Filters
                  </Button>
                </Grid>
                <Grid item xs>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                    <TextField 
                      size="small" 
                      placeholder="Search table" 
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      sx={{ 
                        width: 300,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#FFFFFF',
                          '& fieldset': { borderColor: '#E0E0E0' },
                          '&:hover fieldset': { borderColor: '#BDC3C7' },
                          '&.Mui-focused fieldset': { borderColor: '#0b87ac' },
                        },
                        '& .MuiInputBase-input': {
                          color: '#0b87ac',
                          fontSize: '0.9rem',
                          '&::placeholder': {
                            color: '#95A5A6',
                            opacity: 1
                          }
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" sx={{ color: '#7F8C8D' }}>
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Filter Section */}
              <Collapse in={showFilters}>
                <Box sx={{ mt: 3, p: 4, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E0E0E0', m: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0b87ac' }}>
                      Search Filters
                    </Typography>
                    {hasActiveFilters && (
                      <Button
                        startIcon={<ClearIcon />}
                        onClick={clearFilters}
                        size="small"
                        sx={{ 
                          textTransform: 'none', 
                          color: '#E74C3C',
                          '&:hover': {
                            bgcolor: '#FDF2F2',
                            color: '#C0392B'
                          }
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                  </Box>
                  
                                                                      <Grid container spacing={4}>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ color: '#0b87ac', fontWeight: 600 }}>Barangay</InputLabel>
                          <Select
                            value={filters.barangay}
                            onChange={(e) => handleFilterChange('barangay', e.target.value)}
                            label="Barangay"
                            sx={{
                              bgcolor: '#FFFFFF',
                              minWidth: 200,
                              '& .MuiSelect-select': {
                                color: '#0b87ac',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                py: 1.5
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#E0E0E0'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#BDC3C7'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#0b87ac'
                              },
                              '& .MuiPaper-root': {
                                bgcolor: '#FFFFFF'
                              }
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  bgcolor: '#FFFFFF',
                                  minWidth: 250,
                                  '& .MuiMenuItem-root': {
                                    color: '#0b87ac',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    py: 1.5,
                                    '&:hover': {
                                      bgcolor: '#F8FAFC'
                                    },
                                    '&.Mui-selected': {
                                      bgcolor: '#E3F2FD',
                                      color: '#1976D2',
                                      '&:hover': {
                                        bgcolor: '#E3F2FD'
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                          >
                          <MenuItem value="" sx={{ color: '#95A5A6', fontWeight: 600 }}>All Barangays</MenuItem>
                          {barangays.map(barangay => (
                            <MenuItem key={barangay} value={barangay} sx={{ color: '#0b87ac', fontWeight: 600 }}>
                              {barangay}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                                        <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ color: '#0b87ac', fontWeight: 600 }}>Disability Type</InputLabel>
                          <Select
                            value={filters.disability}
                            onChange={(e) => handleFilterChange('disability', e.target.value)}
                            label="Disability Type"
                            sx={{
                              bgcolor: '#FFFFFF',
                              minWidth: 200,
                              '& .MuiSelect-select': {
                                color: '#0b87ac',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                py: 1.5
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#E0E0E0'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#BDC3C7'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#0b87ac'
                              },
                              '& .MuiPaper-root': {
                                bgcolor: '#FFFFFF'
                              }
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  bgcolor: '#FFFFFF',
                                  minWidth: 250,
                                  '& .MuiMenuItem-root': {
                                    color: '#0b87ac',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    py: 1.5,
                                    '&:hover': {
                                      bgcolor: '#F8FAFC'
                                    },
                                    '&.Mui-selected': {
                                      bgcolor: '#E3F2FD',
                                      color: '#1976D2',
                                      '&:hover': {
                                        bgcolor: '#E3F2FD'
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                          >
                          <MenuItem value="" sx={{ color: '#95A5A6', fontWeight: 600 }}>All Disabilities</MenuItem>
                          {disabilityTypes.map(disability => (
                            <MenuItem key={disability} value={disability} sx={{ color: '#0b87ac', fontWeight: 600 }}>
                              {disability}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                                        <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ color: '#0b87ac', fontWeight: 600 }}>Age Range</InputLabel>
                          <Select
                            value={filters.ageRange}
                            onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                            label="Age Range"
                            sx={{
                              bgcolor: '#FFFFFF',
                              minWidth: 200,
                              '& .MuiSelect-select': {
                                color: '#0b87ac',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                py: 1.5
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#E0E0E0'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#BDC3C7'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#0b87ac'
                              },
                              '& .MuiPaper-root': {
                                bgcolor: '#FFFFFF'
                              }
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  bgcolor: '#FFFFFF',
                                  minWidth: 250,
                                  '& .MuiMenuItem-root': {
                                    color: '#0b87ac',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    py: 1.5,
                                    '&:hover': {
                                      bgcolor: '#F8FAFC'
                                    },
                                    '&.Mui-selected': {
                                      bgcolor: '#E3F2FD',
                                      color: '#1976D2',
                                      '&:hover': {
                                        bgcolor: '#E3F2FD'
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                          >
                          <MenuItem value="" sx={{ color: '#95A5A6', fontWeight: 600 }}>All Ages</MenuItem>
                          {ageRanges.map(range => (
                            <MenuItem key={range} value={range} sx={{ color: '#0b87ac', fontWeight: 600 }}>
                              {range}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                                        <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ color: '#0b87ac', fontWeight: 600 }}>Status</InputLabel>
                          <Select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            label="Status"
                            sx={{
                              bgcolor: '#FFFFFF',
                              minWidth: 200,
                              '& .MuiSelect-select': {
                                color: '#0b87ac',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                py: 1.5
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#E0E0E0'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#BDC3C7'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#0b87ac'
                              },
                              '& .MuiPaper-root': {
                                bgcolor: '#FFFFFF'
                              }
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  bgcolor: '#FFFFFF',
                                  minWidth: 250,
                                  '& .MuiMenuItem-root': {
                                    color: '#0b87ac',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    py: 1.5,
                                    '&:hover': {
                                      bgcolor: '#F8FAFC'
                                    },
                                    '&.Mui-selected': {
                                      bgcolor: '#E3F2FD',
                                      color: '#1976D2',
                                      '&:hover': {
                                        bgcolor: '#E3F2FD'
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                          >
                          <MenuItem value="" sx={{ color: '#95A5A6', fontWeight: 600 }}>All Statuses</MenuItem>
                          {statuses.map(status => (
                            <MenuItem key={status} value={status} sx={{ color: '#0b87ac', fontWeight: 600 }}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                                  {/* Active Filters Display */}
                  {hasActiveFilters && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" sx={{ color: '#0b87ac', mb: 2, fontWeight: 600 }}>
                        Active Filters:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {Object.entries(filters).map(([key, value]) => {
                          if (value && key !== 'search') {
                            return (
                              <Chip
                                key={key}
                                label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
                                onDelete={() => handleFilterChange(key, '')}
                                size="small"
                                sx={{ 
                                  bgcolor: '#0b87ac', 
                                  color: '#FFFFFF',
                                  fontWeight: 600,
                                  '& .MuiChip-deleteIcon': {
                                    color: '#FFFFFF',
                                    '&:hover': {
                                      color: '#E8F4FD'
                                    }
                                  }
                                }}
                              />
                            );
                          }
                          return null;
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Collapse>

              <Box sx={{ borderTop: '2px solid #BDC3C7', mt: 3, mx: 1 }} />

              {/* Results Summary */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mx: 1 }}>
                <Typography variant="body2" sx={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  bgcolor: '#0b87ac',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.9rem'
                }}>
                  Showing {filteredRows.length} of {tab === 0 ? rows.length : applications.length} records
                  {hasActiveFilters && ' (filtered)'}
                </Typography>
              </Box>

              <Box sx={{ mt: 4, mx: 1 }}>
                <Paper elevation={0} sx={{ border: '1px solid #D6DBDF', borderRadius: 2, overflow: 'hidden', p: 1, bgcolor: 'white' }}>
                  <Box sx={{ bgcolor: 'white', color: '#0b87ac', p: 2, m: 1, borderBottom: '2px solid #E0E0E0' }}>
                    <Typography sx={{ fontWeight: 800, textAlign: 'center', color: '#0b87ac' }}>
                      {tab === 0 ? 'PWD MASTERLIST' : 'PENDING APPLICATIONS'}
                    </Typography>
                  </Box>

                  {loading && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography sx={{ color: '#0b87ac' }}>Loading...</Typography>
                    </Box>
                  )}

                  {error && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography sx={{ color: '#E74C3C' }}>{error}</Typography>
                    </Box>
                  )}

                  {!loading && !error && (
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'white', borderBottom: '2px solid #E0E0E0' }}>
                          {tab === 0 ? (
                            <>
                              <TableCell width={60} sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                PWD ID NO.
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Name
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Age
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Barangay
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Disability
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Guardian Name
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Contact No.
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Status
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Application ID
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Name
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Email
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Disability Type
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Contact Number
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Submission Date
                              </TableCell>
                              <TableCell sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                                Status
                              </TableCell>
                            </>
                          )}
                          <TableCell align="right" sx={{ color: '#0b87ac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, px: 2 }}>
                            Actions
                          </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.map((row, idx) => (
                          <TableRow key={row.applicationID || row.id} sx={{ bgcolor: idx % 2 ? '#F7FBFF' : 'white' }}>
                            {tab === 0 ? (
                              <>
                                <TableCell sx={{ color: '#34495E', fontWeight: 600, fontSize: '0.8rem', py: 2, px: 2 }}>
                                  {row.pwdId}
                                </TableCell>
                                <TableCell sx={{ color: '#0b87ac', fontWeight: 500, py: 2, px: 2 }}>
                                  {row.name}
                                </TableCell>
                                <TableCell sx={{ color: '#34495E', fontWeight: 600, py: 2, px: 2 }}>
                                  {row.age}
                                </TableCell>
                                <TableCell sx={{ color: '#0b87ac', fontWeight: 500, py: 2, px: 2 }}>
                                  {row.barangay}
                                </TableCell>
                                <TableCell sx={{ color: '#0b87ac', fontWeight: 500, py: 2, px: 2 }}>
                                  {row.disability}
                                </TableCell>
                                <TableCell sx={{ color: '#0b87ac', fontWeight: 500, py: 2, px: 2 }}>
                                  {row.guardian}
                                </TableCell>
                                <TableCell sx={{ color: '#34495E', fontWeight: 500, py: 2, px: 2 }}>
                                  {row.contact}
                                </TableCell>
                                <TableCell sx={{ py: 2, px: 2 }}>
                                  <Chip 
                                    label={row.status} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: row.status === 'Active' ? '#27AE60' : 
                                            row.status === 'Pending' ? '#F39C12' : 
                                            row.status === 'Suspended' ? '#E74C3C' : '#95A5A6',
                                      color: '#FFFFFF',
                                      fontSize: '0.7rem',
                                      fontWeight: 600
                                    }}
                                  />
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell sx={{ color: '#34495E', fontWeight: 600, fontSize: '0.8rem', py: 2, px: 2 }}>
                                  {row.applicationID}
                                </TableCell>
                                <TableCell sx={{ color: '#0b87ac', fontWeight: 600, py: 2, px: 2 }}>
                                  {`${row.firstName} ${row.lastName}`}
                                </TableCell>
                                <TableCell sx={{ color: '#D35400', fontWeight: 500, py: 2, px: 2 }}>
                                  {row.email}
                                </TableCell>
                                <TableCell sx={{ color: '#8E44AD', fontWeight: 500, py: 2, px: 2 }}>
                                  {row.disabilityType}
                                </TableCell>
                                <TableCell sx={{ color: '#16A085', fontWeight: 500, py: 2, px: 2 }}>
                                  {row.contactNumber}
                                </TableCell>
                                <TableCell sx={{ color: '#E67E22', fontWeight: 500, py: 2, px: 2 }}>
                                  {new Date(row.submissionDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell sx={{ py: 2, px: 2 }}>
                                  <Chip 
                                    label={row.status || 'Pending'} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: (row.status || 'Pending') === 'Approved' ? '#27AE60' : 
                                            (row.status || 'Pending') === 'Pending' ? '#F39C12' : 
                                            (row.status || 'Pending') === 'Rejected' ? '#E74C3C' : '#95A5A6',
                                      color: '#FFFFFF',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                  />
                                </TableCell>
                              </>
                            )}
                          <TableCell align="right" sx={{ py: 2, px: 2 }}>
                            {tab === 0 ? (
                              <Button 
                                size="small" 
                                variant="outlined" 
                                sx={{ 
                                  textTransform: 'none',
                                  color: '#0b87ac',
                                  borderColor: '#0b87ac',
                                  fontWeight: 600,
                                  '&:hover': {
                                    bgcolor: '#0b87ac',
                                    color: '#FFFFFF',
                                    borderColor: '#0b87ac'
                                  }
                                }}
                              >
                                View/Edit
                              </Button>
                            ) : (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleViewDetails(row)}
                                  sx={{
                                    borderColor: '#0b87ac',
                                    color: '#0b87ac',
                                    textTransform: 'none',
                                    fontSize: '0.7rem',
                                    py: 0.5,
                                    px: 1,
                                    '&:hover': {
                                      borderColor: '#0a6b8a',
                                      bgcolor: '#0b87ac',
                                      color: '#FFFFFF'
                                    }
                                  }}
                                >
                                  View Details
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleApproveApplication(row.applicationID)}
                                  sx={{
                                    bgcolor: '#27AE60',
                                    textTransform: 'none',
                                    fontSize: '0.7rem',
                                    py: 0.5,
                                    px: 1,
                                    '&:hover': {
                                      bgcolor: '#229954'
                                    }
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleRejectApplication(row.applicationID)}
                                  sx={{
                                    borderColor: '#E74C3C',
                                    color: '#E74C3C',
                                    textTransform: 'none',
                                    fontSize: '0.7rem',
                                    py: 0.5,
                                    px: 1,
                                    '&:hover': {
                                      borderColor: '#C0392B',
                                      bgcolor: '#FDF2F2'
                                    }
                                  }}
                                >
                                  Reject
                                </Button>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  )}
                </Paper>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Application Details Modal */}
        <Dialog
          open={viewDetailsOpen}
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              p: 2,
              m: 2
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: '#0b87ac', 
            color: 'white', 
            textAlign: 'center',
            py: 2,
            position: 'relative'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              PWD Application Details
            </Typography>
            <IconButton
              onClick={handleCloseDetails}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 2 }}>
            {selectedApplication && (
              <Box id="application-details" sx={{ p: 4 }}>
                {/* Header Section */}
                <Paper sx={{ 
                  p: 3, 
                  mb: 3, 
                  bgcolor: '#F8F9FA',
                  border: '2px solid #E9ECEF',
                  borderRadius: 2
                }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 'bold', 
                      color: '#0b87ac',
                      mb: 1
                    }}>
                      CABUYAO PDAO RMS
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: '#7F8C8D',
                      fontWeight: 500
                    }}>
                      Persons with Disabilities Application Form
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E' }}>
                        Application ID:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac' }}>
                        {selectedApplication.applicationID}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E' }}>
                        Submission Date:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac' }}>
                        {new Date(selectedApplication.submissionDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Personal Information */}
                <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#0b87ac', 
                    mb: 2,
                    borderBottom: '2px solid #0b87ac',
                    pb: 1
                  }}>
                    Personal Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        First Name:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.firstName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Last Name:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Middle Name:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.middleName || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Birth Date:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {new Date(selectedApplication.birthDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Gender:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.gender}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Civil Status:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.civilStatus || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Disability Information */}
                <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#0b87ac', 
                    mb: 2,
                    borderBottom: '2px solid #E74C3C',
                    pb: 1
                  }}>
                    Disability Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Disability Type:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.disabilityType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Disability Cause:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.disabilityCause || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Disability Date:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.disabilityDate ? new Date(selectedApplication.disabilityDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Contact Information */}
                <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#0b87ac', 
                    mb: 2,
                    borderBottom: '2px solid #27AE60',
                    pb: 1
                  }}>
                    Contact Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Email Address:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Contact Number:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.contactNumber || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Emergency Contact:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.emergencyContact || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Emergency Phone:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.emergencyPhone || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Emergency Relationship:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.emergencyRelationship || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Address Information */}
                <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#0b87ac', 
                    mb: 2,
                    borderBottom: '2px solid #F39C12',
                    pb: 1
                  }}>
                    Address Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Complete Address:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.address}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Barangay:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.barangay || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        City:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.city || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Postal Code:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.postalCode || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Uploaded Documents */}
                <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#0b87ac', 
                    mb: 2,
                    borderBottom: '2px solid #8E44AD',
                    pb: 1
                  }}>
                    Uploaded Documents
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 1 }}>
                        ID Picture (2x2):
                      </Typography>
                      {selectedApplication.idPicture ? (
                        <Box sx={{ textAlign: 'center' }}>
                          <img 
                            src={`http://127.0.0.1:8000/storage/${selectedApplication.idPicture}`}
                            alt="ID Picture"
                            style={{
                              maxWidth: '150px',
                              maxHeight: '150px',
                              border: '2px solid #E9ECEF',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <Typography variant="body2" sx={{ 
                            display: 'none', 
                            color: '#7F8C8D', 
                            fontStyle: 'italic',
                            mt: 1
                          }}>
                            File not found or invalid
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1, fontSize: '0.7rem' }}
                            onClick={() => window.open(`http://127.0.0.1:8000/storage/${selectedApplication.idPicture}`, '_blank')}
                          >
                            View Full Size
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#7F8C8D', fontStyle: 'italic' }}>
                          No file uploaded
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 1 }}>
                        Medical Certificate:
                      </Typography>
                      {selectedApplication.medicalCertificate ? (
                        <Box sx={{ textAlign: 'center' }}>
                          <img 
                            src={`http://127.0.0.1:8000/storage/${selectedApplication.medicalCertificate}`}
                            alt="Medical Certificate"
                            style={{
                              maxWidth: '150px',
                              maxHeight: '150px',
                              border: '2px solid #E9ECEF',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <Typography variant="body2" sx={{ 
                            display: 'none', 
                            color: '#7F8C8D', 
                            fontStyle: 'italic',
                            mt: 1
                          }}>
                            File not found or invalid
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1, fontSize: '0.7rem' }}
                            onClick={() => window.open(`http://127.0.0.1:8000/storage/${selectedApplication.medicalCertificate}`, '_blank')}
                          >
                            View Full Size
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#7F8C8D', fontStyle: 'italic' }}>
                          No file uploaded
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 1 }}>
                        Barangay Clearance:
                      </Typography>
                      {selectedApplication.barangayClearance ? (
                        <Box sx={{ textAlign: 'center' }}>
                          <img 
                            src={`http://127.0.0.1:8000/storage/${selectedApplication.barangayClearance}`}
                            alt="Barangay Clearance"
                            style={{
                              maxWidth: '150px',
                              maxHeight: '150px',
                              border: '2px solid #E9ECEF',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <Typography variant="body2" sx={{ 
                            display: 'none', 
                            color: '#7F8C8D', 
                            fontStyle: 'italic',
                            mt: 1
                          }}>
                            File not found or invalid
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1, fontSize: '0.7rem' }}
                            onClick={() => window.open(`http://127.0.0.1:8000/storage/${selectedApplication.barangayClearance}`, '_blank')}
                          >
                            View Full Size
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#7F8C8D', fontStyle: 'italic' }}>
                          No file uploaded
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Paper>

                {/* Status Information */}
                <Paper sx={{ p: 3, border: '1px solid #DEE2E6' }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#0b87ac', 
                    mb: 2,
                    borderBottom: '2px solid #9B59B6',
                    pb: 1
                  }}>
                    Application Status
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Current Status:
                      </Typography>
                      <Chip 
                        label={selectedApplication.status || 'Pending'} 
                        sx={{ 
                          bgcolor: (selectedApplication.status || 'Pending') === 'Approved' ? '#27AE60' : 
                                (selectedApplication.status || 'Pending') === 'Pending' ? '#F39C12' : 
                                (selectedApplication.status || 'Pending') === 'Rejected' ? '#E74C3C' : '#95A5A6',
                          color: '#FFFFFF',
                          fontWeight: 'bold'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E', mb: 0.5 }}>
                        Remarks:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b87ac', mb: 1 }}>
                        {selectedApplication.remarks || 'No remarks provided'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 3, 
            bgcolor: '#F8F9FA',
            borderTop: '1px solid #DEE2E6',
            m: 1
          }}>
            <Button
              onClick={handleCloseDetails}
              variant="outlined"
              sx={{
                borderColor: '#6C757D',
                color: '#6C757D',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Close
            </Button>
            <Button
              onClick={handlePrintApplication}
              variant="contained"
              startIcon={<PrintIcon />}
              sx={{
                bgcolor: '#0b87ac',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#1B2631'
                }
              }}
            >
              Print Application
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  export default PWDRecords;
