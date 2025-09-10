import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Assessment,
  Download,
  Print,
  FilterList,
  Visibility,
  TrendingUp,
  People,
  CreditCard,
  VolunteerActivism
} from '@mui/icons-material';
import AdminSidebar from '../shared/AdminSidebar';
import { reportsService } from '../../services/reportsService';
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

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState(null);
  const [cityStats, setCityStats] = useState({
    total_pwd_members: 0,
    total_applications: 0,
    pending_applications: 0,
    total_barangays: 0
  });
  const [barangayPerformance, setBarangayPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, performanceData] = await Promise.all([
        reportsService.getCityWideStats(),
        reportsService.getBarangayPerformance()
      ]);
      setCityStats(statsData);
      setBarangayPerformance(performanceData.barangays);
    } catch (error) {
      console.error('Error loading data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportType) => {
    try {
      setGenerating(prev => ({ ...prev, [reportType]: true }));
      const data = await reportsService.generateReport(reportType);
      
      setSnackbar({
        open: true,
        message: `${reportType} report generated successfully`,
        severity: 'success'
      });
      
      console.log('Report data:', data);
      
    } catch (error) {
      console.error('Error generating report:', error);
      setSnackbar({
        open: true,
        message: 'Failed to generate report',
        severity: 'error'
      });
    } finally {
      setGenerating(prev => ({ ...prev, [reportType]: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const reports = [
    {
      id: 1,
      title: 'PWD Registration Report',
      description: 'Monthly registration statistics and trends',
      icon: <People />,
      color: '#3498DB',
      lastUpdated: '2025-01-15',
      status: 'Available',
      reportType: 'registration'
    },
    {
      id: 2,
      title: 'Card Distribution Report',
      description: 'PWD card issuance and distribution data',
      icon: <CreditCard />,
      color: '#27AE60',
      lastUpdated: '2025-01-14',
      status: 'Available',
      reportType: 'cards'
    },
    {
      id: 3,
      title: 'Benefits Distribution Report',
      description: 'Ayuda and benefits distribution statistics',
      icon: <VolunteerActivism />,
      color: '#E74C3C',
      lastUpdated: '2025-01-13',
      status: 'Available',
      reportType: 'benefits'
    },
    {
      id: 4,
      title: 'Complaints Analysis Report',
      description: 'Feedback and complaints analysis',
      icon: <Assessment />,
      color: '#F39C12',
      lastUpdated: '2025-01-12',
      status: 'Available',
      reportType: 'complaints'
    },
    {
      id: 5,
      title: 'Barangay Performance Report',
      description: 'Performance metrics by barangay',
      icon: <TrendingUp />,
      color: '#9B59B6',
      lastUpdated: '2025-01-11',
      status: 'Available',
      reportType: 'performance'
    },
    {
      id: 6,
      title: 'Annual Summary Report',
      description: 'Comprehensive annual statistics',
      icon: <Assessment />,
      color: '#34495E',
      lastUpdated: '2024-12-31',
      status: 'Available',
      reportType: 'annual'
    }
  ];

  const mockData = [
    { barangay: 'Bigaa', registered: 245, cards: 230, benefits: 180, complaints: 5 },
    { barangay: 'Butong', registered: 189, cards: 175, benefits: 145, complaints: 3 },
    { barangay: 'Marinig', registered: 312, cards: 298, benefits: 265, complaints: 8 },
    { barangay: 'Gulod', registered: 156, cards: 142, benefits: 120, complaints: 2 },
    { barangay: 'Baclaran', registered: 278, cards: 265, benefits: 230, complaints: 6 },
    { barangay: 'San Isidro', registered: 198, cards: 185, benefits: 155, complaints: 4 }
  ];

  const handleReportClick = (report) => {
    setSelectedReportData(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReportData(null);
  };

  const getStatusColor = (status) => {
    return status === 'Available' ? 'success' : 'warning';
  };

    return (
    <Box sx={mainContainerStyles}>
      <AdminSidebar />
      
      <Box sx={contentAreaStyles}>
        <Paper sx={cardStyles}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#2C3E50' }}>
              Reports & Analytics
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel sx={{ color: '#7F8C8D' }}>Report Type</InputLabel>
                <Select
                  value={selectedReport}
                  label="Report Type"
                  onChange={(e) => setSelectedReport(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#E0E0E0' },
                      '&:hover fieldset': { borderColor: '#BDC3C7' },
                      '&.Mui-focused fieldset': { borderColor: '#3498DB' },
                    },
                    '& .MuiSelect-select': { color: '#2C3E50' }
                  }}
                >
                  <MenuItem value="">All Reports</MenuItem>
                  <MenuItem value="registration">Registration</MenuItem>
                  <MenuItem value="cards">Card Distribution</MenuItem>
                  <MenuItem value="benefits">Benefits</MenuItem>
                  <MenuItem value="complaints">Complaints</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel sx={{ color: '#7F8C8D' }}>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={(e) => setDateRange(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#E0E0E0' },
                      '&:hover fieldset': { borderColor: '#BDC3C7' },
                      '&.Mui-focused fieldset': { borderColor: '#3498DB' },
                    },
                    '& .MuiSelect-select': { color: '#2C3E50' }
                  }}
                >
                  <MenuItem value="">All Time</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {reports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    border: '1px solid #E0E0E0',
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: `${report.color}15`,
                        mr: 2
                      }}>
                        {React.cloneElement(report.icon, { sx: { color: report.color, fontSize: 24 } })}
                      </Box>
                      <Chip 
                        label={report.status} 
                        color={getStatusColor(report.status)} 
                        size="small" 
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: '#2C3E50', fontSize: '1.1rem' }}>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7F8C8D', mb: 2, lineHeight: 1.5 }}>
                      {report.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#95A5A6', fontWeight: 500 }}>
                      Last updated: {report.lastUpdated}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, borderTop: '1px solid #F0F0F0' }}>
                    <Button 
                      size="small" 
                      startIcon={<Visibility />}
                      onClick={() => handleReportClick(report)}
                      sx={{ 
                        color: report.color, 
                        fontWeight: 600,
                        '&:hover': { bgcolor: `${report.color}10` }
                      }}
                    >
                      View Report
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={generating[report.reportType] ? <CircularProgress size={16} /> : <Download />}
                      disabled={generating[report.reportType]}
                      onClick={() => handleGenerateReport(report.reportType)}
                      sx={{ 
                        color: report.color, 
                        fontWeight: 600,
                        '&:hover': { bgcolor: `${report.color}10` }
                      }}
                    >
                      {generating[report.reportType] ? 'Generating...' : 'Generate'}
                    </Button>
                    <IconButton size="small" sx={{ color: '#7F8C8D', '&:hover': { bgcolor: '#F0F0F0' } }}>
                      <Print />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Stats Table */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#2C3E50', fontSize: '1.2rem' }}>
              Barangay Performance Summary
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Barangay</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Registered PWDs</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Cards Issued</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Benefits Distributed</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Complaints</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', p: 4 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    barangayPerformance.map((row, index) => (
                      <TableRow key={row.barangay} sx={{ bgcolor: index % 2 ? '#F8FAFC' : '#FFFFFF' }}>
                        <TableCell sx={{ fontWeight: 500, color: '#2C3E50' }}>{row.barangay}</TableCell>
                        <TableCell sx={{ color: '#2C3E50', fontWeight: 500 }}>{row.registered}</TableCell>
                        <TableCell sx={{ color: '#2C3E50', fontWeight: 500 }}>{row.cards}</TableCell>
                        <TableCell sx={{ color: '#2C3E50', fontWeight: 500 }}>{row.benefits}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.complaints} 
                            color={row.complaints > 5 ? 'error' : 'success'} 
                            size="small" 
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            sx={{ 
                              textTransform: 'none', 
                              fontWeight: 600,
                              borderColor: '#3498DB',
                              color: '#3498DB',
                              '&:hover': { 
                                bgcolor: '#3498DB', 
                                color: '#FFFFFF',
                                borderColor: '#3498DB'
                              }
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

        {/* Report Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth sx={dialogStyles}>
          <DialogTitle sx={dialogTitleStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {selectedReportData && React.cloneElement(selectedReportData.icon, { 
                sx: { color: selectedReportData.color, fontSize: 24 } 
              })}
              <Typography variant="h6">
                {selectedReportData?.title}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={dialogContentStyles}>
            {selectedReportData && (
              <Box>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {selectedReportData.description}
                </Typography>
                <Box sx={{ 
                  bgcolor: '#F8FAFC', 
                  border: '1px solid #E8E8E8', 
                  borderRadius: 1, 
                  p: 3,
                  textAlign: 'center',
                  minHeight: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ color: '#7F8C8D' }}>
                    Detailed report content would be displayed here
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={dialogActionsStyles}>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button variant="contained" startIcon={<Download />}>
              Download Report
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  </Box>
  );
};

export default Reports;
