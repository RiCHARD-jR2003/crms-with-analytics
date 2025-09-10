import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import BarangayPresidentSidebar from '../shared/BarangayPresidentSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { reportsService } from '../../services/reportsService';

function BarangayPresidentReports() {
  const { currentUser } = useAuth();
  const barangay = currentUser?.barangay || 'Barangay Poblacion';
  
  const [stats, setStats] = useState({
    total_pwd_members: 0,
    pending_applications: 0,
    new_this_month: 0,
    unclaimed_cards: 0
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadStats();
  }, [barangay]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getBarangayStats(barangay);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load statistics',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportType) => {
    try {
      setGenerating(prev => ({ ...prev, [reportType]: true }));
      
      let data;
      switch (reportType) {
        case 'masterlist':
          data = await reportsService.getPWDMasterlist(barangay);
          break;
        case 'application-status':
          data = await reportsService.getApplicationStatusReport(barangay);
          break;
        case 'disability-distribution':
          data = await reportsService.getDisabilityDistribution(barangay);
          break;
        case 'age-group-analysis':
          data = await reportsService.getAgeGroupAnalysis(barangay);
          break;
        case 'benefit-distribution':
          data = await reportsService.getBenefitDistribution(barangay);
          break;
        case 'monthly-activity':
          data = await reportsService.getMonthlyActivitySummary(barangay);
          break;
        default:
          data = await reportsService.generateReport(reportType);
      }
      
      setSnackbar({
        open: true,
        message: `${reportType.replace('-', ' ')} report generated successfully`,
        severity: 'success'
      });
      
      // In a real implementation, you would trigger a download here
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

  const ReportCard = ({ title, description, icon, color = '#3498DB', reportType }) => (
    <Paper elevation={0} sx={{
      p: 3,
      border: '1px solid #E0E0E0',
      borderRadius: 2,
      bgcolor: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderColor: color
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}15`
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
        </Box>
        <Typography sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '1.1rem' }}>
          {title}
        </Typography>
      </Box>
      <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem', mb: 2, flex: 1 }}>
        {description}
      </Typography>
      <Button
        variant="outlined"
        startIcon={generating[reportType] ? <CircularProgress size={16} /> : <DownloadIcon />}
        disabled={generating[reportType]}
        onClick={() => handleGenerateReport(reportType)}
        sx={{
          color: color,
          borderColor: color,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            borderColor: color,
            backgroundColor: `${color}08`
          }
        }}
      >
        {generating[reportType] ? 'Generating...' : 'Generate Report'}
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F7FC' }}>
      <BarangayPresidentSidebar />
      
      {/* Main content */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        ml: '280px',
        width: 'calc(100% - 280px)',
        p: 3
      }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '2rem', color: '#2C3E50', mb: 1 }}>
            Reports - {barangay}
          </Typography>
          <Typography sx={{ color: '#7F8C8D', fontSize: '1rem' }}>
            Generate and view reports for {barangay}
          </Typography>
        </Box>

        {/* Reports Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <ReportCard
              title="PWD Masterlist Report"
              description={`Complete list of all registered PWD members in ${barangay} with their details and current status.`}
              icon={<TableChartIcon />}
              color="#3498DB"
              reportType="masterlist"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <ReportCard
              title="Application Status Report"
              description={`Summary of pending, approved, and rejected PWD applications in ${barangay}.`}
              icon={<BarChartIcon />}
              color="#27AE60"
              reportType="application-status"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <ReportCard
              title="Disability Distribution"
              description={`Statistical breakdown of disability types among PWD members in ${barangay}.`}
              icon={<PieChartIcon />}
              color="#E74C3C"
              reportType="disability-distribution"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <ReportCard
              title="Age Group Analysis"
              description={`Age distribution and demographic analysis of PWD members in ${barangay}.`}
              icon={<BarChartIcon />}
              color="#F39C12"
              reportType="age-group-analysis"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <ReportCard
              title="Benefit Distribution Report"
              description={`Report on benefits distributed to PWD members in ${barangay} and their utilization.`}
              icon={<TableChartIcon />}
              color="#9B59B6"
              reportType="benefit-distribution"
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <ReportCard
              title="Monthly Activity Summary"
              description={`Monthly summary of activities, applications, and updates for ${barangay}.`}
              icon={<BarChartIcon />}
              color="#1ABC9C"
              reportType="monthly-activity"
            />
          </Grid>
        </Grid>

        {/* Quick Stats */}
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '1.3rem', mb: 2 }}>
            Quick Statistics - {barangay}
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={0} sx={{
                  p: 2,
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  bgcolor: '#FFFFFF',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#27AE60' }}>
                    {stats.total_pwd_members}
                  </Typography>
                  <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Total PWD Members</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={0} sx={{
                  p: 2,
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  bgcolor: '#FFFFFF',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#F39C12' }}>
                    {stats.pending_applications}
                  </Typography>
                  <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Pending Applications</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={0} sx={{
                  p: 2,
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  bgcolor: '#FFFFFF',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#3498DB' }}>
                    {stats.new_this_month}
                  </Typography>
                  <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem' }}>New This Month</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={0} sx={{
                  p: 2,
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  bgcolor: '#FFFFFF',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#E74C3C' }}>
                    {stats.unclaimed_cards}
                  </Typography>
                  <Typography sx={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Unclaimed Cards</Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
        
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
      </Box>
    </Box>
  );
}

export default BarangayPresidentReports;
