import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  InputAdornment,
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
import BarangayPresidentSidebar from '../shared/BarangayPresidentSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

// Helper function to convert text to proper case
const toProperCase = (text) => {
  if (!text) return '';
  return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

function BarangayPresidentPWDRecords() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    barangay: '',
    disability: '',
    status: ''
  });

  // Mock data - in real implementation, this would fetch from API filtered by barangay
  const [rows, setRows] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const barangay = currentUser?.barangay || 'Unknown Barangay';
      
      // Fetch applications pending barangay approval for this barangay
      const applicationsUrl = `/applications/barangay/${encodeURIComponent(barangay)}/status/Pending%20Barangay%20Approval`;
      
      try {
        const applicationsData = await api.get(applicationsUrl);
        // Transform applications data to proper case
        const transformedApplications = applicationsData.map(app => ({
          ...app,
          firstName: toProperCase(app.firstName),
          lastName: toProperCase(app.lastName),
          disabilityType: toProperCase(app.disabilityType)
        }));
        setApplications(transformedApplications);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setApplications([]);
      }

      // Fetch approved applications (masterlist) for this barangay
      const masterlistUrl = `/applications/barangay/${encodeURIComponent(barangay)}/status/Approved`;
      
      try {
        const masterlistData = await api.get(masterlistUrl);
        // Transform the data to match the expected format
        const transformedData = masterlistData.map((app, index) => ({
          id: app.applicationID || index + 1,
          pwdID: `PWD-${String(app.applicationID || index + 1).padStart(3, '0')}`,
          firstName: toProperCase(app.firstName),
          lastName: toProperCase(app.lastName),
          barangay: app.barangay,
          disabilityType: toProperCase(app.disabilityType),
          status: 'Active', // All approved applications are considered active
          contactNumber: app.contactNumber,
          email: app.email
        }));
        setRows(transformedData);
      } catch (err) {
        console.error('Failed to fetch masterlist data:', err);
        // Fallback to empty array if API fails
        setRows([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
      // Set empty arrays on error
      setApplications([]);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveApplication = async (applicationId) => {
    try {
      await api.post(`/applications/${applicationId}/approve-barangay`, {
        remarks: 'Approved by Barangay President'
      });

      // Refresh the applications list
      await fetchData();
      alert('Application approved successfully!');
    } catch (err) {
      console.error('Error approving application:', err);
      alert('Failed to approve application: ' + (err.message || 'Unknown error'));
    }
  };

  const handleRejectApplication = async (applicationId) => {
    const remarks = prompt('Please provide a reason for rejection:');
    if (!remarks) return;

    try {
      await api.post(`/applications/${applicationId}/reject`, {
        remarks: remarks
      });

      // Refresh the applications list
      await fetchData();
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

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      barangay: '',
      disability: '',
      status: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Filter the rows based on current filters
  const filteredRows = useMemo(() => {
    const dataToFilter = tab === 0 ? rows : applications;
    
    const hasAnyFilters = Object.values(filters).some(value => value !== '');
    if (!hasAnyFilters && !searchTerm) {
      return dataToFilter;
    }

    return dataToFilter.filter(row => {
      // Search term filter
      const matchesSearch = !searchTerm || 
        (row.firstName && row.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.lastName && row.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.pwdID && row.pwdID.toLowerCase().includes(searchTerm.toLowerCase()));

      // Barangay filter
      let matchesBarangay = true;
      if (filters.barangay) {
        matchesBarangay = row.barangay && row.barangay.toLowerCase().includes(filters.barangay.toLowerCase());
      }

      // Disability filter - handle both masterlist and application data
      let matchesDisability = true;
      if (filters.disability) {
        if (tab === 0) {
          // Masterlist data
          matchesDisability = row.disabilityType && row.disabilityType === filters.disability;
        } else {
          // Application data - handle case sensitivity and partial matches
          const rowDisability = row.disabilityType ? row.disabilityType.toLowerCase() : '';
          const filterDisability = filters.disability.toLowerCase();
          
          if (filterDisability.includes('visual')) {
            matchesDisability = rowDisability.includes('visual');
          } else if (filterDisability.includes('physical')) {
            matchesDisability = rowDisability.includes('physical');
          } else {
            matchesDisability = rowDisability.includes(filterDisability);
          }
        }
      }

      // Status filter
      let matchesStatus = true;
      if (filters.status) {
        matchesStatus = row.status && row.status === filters.status;
      }

      return matchesSearch && matchesBarangay && matchesDisability && matchesStatus;
    });
  }, [tab, rows, applications, filters, searchTerm]);

  const paginatedRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredRows.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Approved':
        return '#000000';
      case 'Pending':
      case 'Pending Barangay Approval':
      case 'Pending Admin Approval':
        return '#000000';
      case 'Inactive':
      case 'Rejected':
        return '#000000';
      default:
        return '#000000';
    }
  };

  const columns = tab === 0 ? [
    { id: 'pwdID', label: 'PWD ID', minWidth: 100 },
    { id: 'firstName', label: 'First Name', minWidth: 120 },
    { id: 'lastName', label: 'Last Name', minWidth: 120 },
    { id: 'barangay', label: 'Barangay', minWidth: 150 },
    { id: 'disabilityType', label: 'Disability Type', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'contactNumber', label: 'Contact Number', minWidth: 130 },
    { id: 'email', label: 'Email', minWidth: 180 }
  ] : [
    { id: 'applicationID', label: 'Application ID', minWidth: 120 },
    { id: 'firstName', label: 'First Name', minWidth: 120 },
    { id: 'lastName', label: 'Last Name', minWidth: 120 },
    { id: 'barangay', label: 'Barangay', minWidth: 150 },
    { id: 'disabilityType', label: 'Disability Type', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 150 },
    { id: 'submissionDate', label: 'Submission Date', minWidth: 130 },
    { id: 'contactNumber', label: 'Contact Number', minWidth: 130 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'actions', label: 'Actions', minWidth: 200 }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FFFFFF' }}>
      <BarangayPresidentSidebar />
      
      {/* Main content */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        ml: '280px',
        width: 'calc(100% - 280px)',
        bgcolor: '#FFFFFF'
      }}>
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '2rem', color: '#000000', mb: 1 }}>
              PWD Records - {currentUser?.barangay || 'Your Barangay'}
            </Typography>
            <Typography sx={{ color: '#000000', fontSize: '1rem' }}>
              Manage and view PWD records for {currentUser?.barangay || 'your barangay'}
            </Typography>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              bgcolor: 'white',
              borderRadius: 2,
              border: '1px solid #000000'
            }}>
              <Typography sx={{ color: '#000000' }}>
                Loading PWD records...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box sx={{ 
              p: 3, 
              bgcolor: '#FFFFFF', 
              borderRadius: 2, 
              border: '1px solid #000000',
              mb: 3
            }}>
              <Typography sx={{ color: '#000000', fontWeight: 600 }}>
                Error: {error}
              </Typography>
              <Typography sx={{ color: '#000000', mt: 1 }}>
                Please try refreshing the page or contact support if the issue persists.
              </Typography>
            </Box>
          )}


          {/* Tabs and Controls */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #000000', mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Tabs 
                  value={tab} 
                  onChange={handleTabChange}
                  sx={{ 
                    minHeight: 40,
                    '& .MuiTab-root': {
                      color: '#000000',
                      fontWeight: 600,
                      textTransform: 'none',
                      bgcolor: '#FFFFFF',
                      borderRadius: '8px 8px 0 0',
                      mx: 0.5,
                      px: 3,
                      '&.Mui-selected': {
                        color: '#000000 !important',
                        fontWeight: 700,
                        bgcolor: '#FFFFFF !important'
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
                    color: '#000000',
                    bgcolor: '#FFFFFF',
                    borderColor: '#000000',
                    '&:hover': {
                      borderColor: '#000000',
                      bgcolor: '#FFFFFF',
                      color: '#000000'
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
                    bgcolor: showFilters ? '#FFFFFF' : '#FFFFFF',
                    color: showFilters ? '#000000' : '#000000',
                    borderColor: '#000000',
                    '&:hover': {
                      bgcolor: showFilters ? '#FFFFFF' : '#FFFFFF',
                      borderColor: '#000000',
                      color: showFilters ? '#000000' : '#000000'
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
                    placeholder="Search by name or ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ 
                      width: 300,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#FFFFFF',
                        '& fieldset': { borderColor: '#000000' },
                        '&:hover fieldset': { borderColor: '#000000' },
                        '&.Mui-focused fieldset': { borderColor: '#000000' },
                      },
                      '& .MuiInputBase-input': {
                        color: '#000000',
                        fontSize: '0.9rem',
                        '&::placeholder': {
                          color: '#000000',
                          opacity: 1
                        }
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" sx={{ color: '#000000' }}>
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
              <Box sx={{ mt: 2, p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #000000' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000' }}>
                    Search Filters
                  </Typography>
                  {hasActiveFilters && (
                    <Button
                      startIcon={<ClearIcon />}
                      onClick={clearFilters}
                      size="small"
                      sx={{ 
                        textTransform: 'none', 
                        color: '#000000',
                        '&:hover': {
                          bgcolor: '#FFFFFF',
                          color: '#000000'
                        }
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: '#000000', fontWeight: 600 }}>Barangay</InputLabel>
                      <Select
                        value={filters.barangay}
                        onChange={(e) => handleFilterChange('barangay', e.target.value)}
                        label="Barangay"
                        sx={{
                          bgcolor: '#FFFFFF',
                          '& .MuiSelect-select': {
                            color: '#000000',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            py: 1.5
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#000000'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#000000'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#000000'
                          }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#FFFFFF',
                              '& .MuiMenuItem-root': {
                                color: '#000000',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                py: 1.5,
                                '&:hover': {
                                  bgcolor: '#FFFFFF'
                                },
                                '&.Mui-selected': {
                                  bgcolor: '#FFFFFF',
                                  color: '#000000',
                                  '&:hover': {
                                    bgcolor: '#FFFFFF'
                                  }
                                }
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#000000', fontWeight: 600 }}>All Barangays</MenuItem>
                        <MenuItem value={currentUser?.barangay || 'Barangay Poblacion'} sx={{ color: '#000000', fontWeight: 600 }}>
                          {currentUser?.barangay || 'Barangay Poblacion'}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: '#000000', fontWeight: 600 }}>Disability Type</InputLabel>
                      <Select
                        value={filters.disability}
                        onChange={(e) => handleFilterChange('disability', e.target.value)}
                        label="Disability Type"
                        sx={{
                          bgcolor: '#FFFFFF',
                          '& .MuiSelect-select': {
                            color: '#000000',
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
                            borderColor: '#3498DB'
                          }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#FFFFFF',
                              '& .MuiMenuItem-root': {
                                color: '#000000',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                py: 1.5,
                                '&:hover': {
                                  bgcolor: '#FFFFFF'
                                },
                                '&.Mui-selected': {
                                  bgcolor: '#FFFFFF',
                                  color: '#000000',
                                  '&:hover': {
                                    bgcolor: '#FFFFFF'
                                  }
                                }
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#000000', fontWeight: 600 }}>All Types</MenuItem>
                        <MenuItem value="Visual Impairment" sx={{ color: '#000000', fontWeight: 600 }}>Visual Impairment</MenuItem>
                        <MenuItem value="Physical Disability" sx={{ color: '#000000', fontWeight: 600 }}>Physical Disability</MenuItem>
                        <MenuItem value="Hearing Impairment" sx={{ color: '#000000', fontWeight: 600 }}>Hearing Impairment</MenuItem>
                        <MenuItem value="Intellectual Disability" sx={{ color: '#000000', fontWeight: 600 }}>Intellectual Disability</MenuItem>
                        <MenuItem value="Mental Health" sx={{ color: '#000000', fontWeight: 600 }}>Mental Health</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: '#000000', fontWeight: 600 }}>Status</InputLabel>
                      <Select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        label="Status"
                        sx={{
                          bgcolor: '#FFFFFF',
                          '& .MuiSelect-select': {
                            color: '#000000',
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
                            borderColor: '#3498DB'
                          }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#FFFFFF',
                              '& .MuiMenuItem-root': {
                                color: '#000000',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                py: 1.5,
                                '&:hover': {
                                  bgcolor: '#FFFFFF'
                                },
                                '&.Mui-selected': {
                                  bgcolor: '#FFFFFF',
                                  color: '#000000',
                                  '&:hover': {
                                    bgcolor: '#FFFFFF'
                                  }
                                }
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#000000', fontWeight: 600 }}>All Status</MenuItem>
                        {tab === 0 ? (
                          <>
                            <MenuItem value="Active" sx={{ color: '#000000', fontWeight: 600 }}>Active</MenuItem>
                            <MenuItem value="Inactive" sx={{ color: '#000000', fontWeight: 600 }}>Inactive</MenuItem>
                          </>
                        ) : (
                          <>
                            <MenuItem value="Pending" sx={{ color: '#000000', fontWeight: 600 }}>Pending</MenuItem>
                            <MenuItem value="Approved" sx={{ color: '#000000', fontWeight: 600 }}>Approved</MenuItem>
                            <MenuItem value="Rejected" sx={{ color: '#000000', fontWeight: 600 }}>Rejected</MenuItem>
                          </>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>

          {/* Table */}
          <Paper elevation={0} sx={{ border: '1px solid #000000', borderRadius: 2 }}>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)', bgcolor: '#FFFFFF' }}>
              <Table stickyHeader sx={{ bgcolor: '#FFFFFF' }}>
                <TableHead sx={{ bgcolor: '#FFFFFF' }}>
                  <TableRow sx={{ bgcolor: '#FFFFFF' }}>
                    {columns.map((column) => (
                                             <TableCell
                         key={column.id}
                         sx={{
                           backgroundColor: '#FFFFFF',
                           color: '#000000',
                           fontWeight: 700,
                           fontSize: '0.95rem',
                           borderBottom: '2px solid #000000',
                           textTransform: 'uppercase',
                           letterSpacing: '0.5px'
                         }}
                       >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row) => (
                    <TableRow hover key={row.applicationID || row.id}>
                      {columns.map((column) => (
                        <TableCell 
                          key={column.id}
                          sx={{ 
                            color: '#000000',
                            borderBottom: '1px solid #000000',
                            fontWeight: 500
                          }}
                        >
                          {column.id === 'status' ? (
                                                         <Chip
                               label={row[column.id]}
                               size="small"
                               sx={{
                                 backgroundColor: `${getStatusColor(row[column.id])}20`,
                                 color: getStatusColor(row[column.id]),
                                 fontWeight: 700,
                                 fontSize: '0.75rem',
                                 textTransform: 'uppercase',
                                 letterSpacing: '0.5px',
                                 border: `1px solid ${getStatusColor(row[column.id])}`,
                                 '&:hover': {
                                   backgroundColor: `${getStatusColor(row[column.id])}30`
                                 }
                               }}
                             />
                          ) : column.id === 'actions' && tab === 1 ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleViewDetails(row)}
                                sx={{
                                  borderColor: '#000000',
                                  color: '#000000',
                                  textTransform: 'none',
                                  fontSize: '0.7rem',
                                  py: 0.5,
                                  px: 1,
                                  '&:hover': {
                                    borderColor: '#000000',
                                    bgcolor: '#FFFFFF',
                                    color: '#000000'
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
                                  bgcolor: '#FFFFFF',
                                  color: '#000000',
                                  textTransform: 'none',
                                  fontSize: '0.7rem',
                                  py: 0.5,
                                  px: 1,
                                  borderColor: '#000000',
                                  '&:hover': {
                                    bgcolor: '#FFFFFF',
                                    color: '#000000'
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
                                  borderColor: '#000000',
                                  color: '#000000',
                                  textTransform: 'none',
                                  fontSize: '0.7rem',
                                  py: 0.5,
                                  px: 1,
                                  '&:hover': {
                                    borderColor: '#000000',
                                    bgcolor: '#FFFFFF',
                                    color: '#000000'
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                                                     ) : (
                             <span style={{
                               color: column.id === 'applicationID' ? '#2C3E50' : 
                                      column.id === 'firstName' || column.id === 'lastName' ? '#34495E' :
                                      column.id === 'barangay' ? '#2980B9' :
                                      column.id === 'disabilityType' ? '#8E44AD' :
                                      column.id === 'submissionDate' ? '#E67E22' :
                                      column.id === 'contactNumber' ? '#16A085' :
                                      column.id === 'email' ? '#D35400' : '#2C3E50',
                               fontWeight: column.id === 'applicationID' ? 700 : 
                                          column.id === 'firstName' || column.id === 'lastName' ? 600 : 500,
                               fontSize: column.id === 'applicationID' ? '0.85rem' : '0.9rem'
                             }}>
                               {row[column.id]}
                             </span>
                           )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: '#000000',
                bgcolor: '#FFFFFF',
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: '#000000',
                  fontWeight: 500
                },
                '& .MuiTablePagination-select': {
                  color: '#000000',
                  bgcolor: '#FFFFFF'
                },
                '& .MuiTablePagination-actions': {
                  color: '#000000'
                },
                '& .MuiIconButton-root': {
                  color: '#000000',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    color: '#000000'
                  }
                }
              }}
            />
          </Paper>

          {/* Summary */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem', fontWeight: 500 }}>
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length} records
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Application Details Modal */}
      <Dialog
        open={viewDetailsOpen}
        onClose={handleCloseDetails}
        maxWidth="xl"
        fullWidth
        fullScreen={false}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#FFFFFF', 
          color: '#000000', 
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
        
        <DialogContent sx={{ p: 0 }}>
          {selectedApplication && (
            <Box id="application-details" sx={{ p: 3 }}>
              {/* Header Section */}
              <Paper sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: 2
              }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 'bold', 
                    color: '#000000',
                    mb: 1
                  }}>
                    CABUYAO PDAO RMS
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#000000',
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
                    <Typography variant="body1" sx={{ color: '#2C3E50' }}>
                      {selectedApplication.applicationID}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#34495E' }}>
                      Submission Date:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50' }}>
                      {new Date(selectedApplication.submissionDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Personal Information */}
              <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#2C3E50', 
                  mb: 2,
                  borderBottom: '2px solid #3498DB',
                  pb: 1
                }}>
                  Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      First Name:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.firstName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Last Name:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Middle Name:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.middleName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Birth Date:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {new Date(selectedApplication.birthDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Gender:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.gender}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Civil Status:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.civilStatus || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Disability Information */}
              <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#2C3E50', 
                  mb: 2,
                  borderBottom: '2px solid #E74C3C',
                  pb: 1
                }}>
                  Disability Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Disability Type:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.disabilityType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Disability Cause:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.disabilityCause || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Disability Date:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.disabilityDate ? new Date(selectedApplication.disabilityDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Contact Information */}
              <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#2C3E50', 
                  mb: 2,
                  borderBottom: '2px solid #27AE60',
                  pb: 1
                }}>
                  Contact Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Email Address:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Contact Number:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.contactNumber || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Emergency Contact:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.emergencyContact || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Emergency Phone:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.emergencyPhone || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Emergency Relationship:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.emergencyRelationship || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Address Information */}
              <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#2C3E50', 
                  mb: 2,
                  borderBottom: '2px solid #F39C12',
                  pb: 1
                }}>
                  Address Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Complete Address:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Barangay:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.barangay || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      City:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.city || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Postal Code:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.postalCode || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Uploaded Documents */}
              <Paper sx={{ p: 3, mb: 3, border: '1px solid #DEE2E6' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#2C3E50', 
                  mb: 2,
                  borderBottom: '2px solid #8E44AD',
                  pb: 1
                }}>
                  Uploaded Documents
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 1 }}>
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
                          color: '#000000', 
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
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 1 }}>
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
                          color: '#000000', 
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
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 1 }}>
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
                          color: '#000000', 
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
                  color: '#2C3E50', 
                  mb: 2,
                  borderBottom: '2px solid #9B59B6',
                  pb: 1
                }}>
                  Application Status
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Current Status:
                    </Typography>
                    <Chip 
                      label={selectedApplication.status || 'Pending'} 
                      sx={{ 
                        bgcolor: (selectedApplication.status || 'Pending') === 'Approved' ? '#FFFFFF' : 
                               (selectedApplication.status || 'Pending') === 'Pending' ? '#FFFFFF' : 
                               (selectedApplication.status || 'Pending') === 'Rejected' ? '#FFFFFF' : '#FFFFFF',
                        color: '#000000',
                        fontWeight: 'bold'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                      Remarks:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', mb: 1 }}>
                      {selectedApplication.remarks || 'No remarks provided'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 2, 
          bgcolor: '#F8F9FA',
          borderTop: '1px solid #DEE2E6'
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
              bgcolor: '#2C3E50',
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

export default BarangayPresidentPWDRecords;
