import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert
} from '@mui/material';
import {
  VolunteerActivism,
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Schedule,
  Warning,
  AttachMoney,
  People,
  LocalShipping,
  Print
} from '@mui/icons-material';
import AdminSidebar from '../shared/AdminSidebar';

const Ayuda = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [benefits, setBenefits] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    type: '',
    amount: '',
    description: '',
    targetRecipients: '',
    distributionDate: '',
    birthdayMonth: '',
    status: 'Active'
  });

  const distributionHistory = [];

  const handleOpenDialog = (benefit = null) => {
    if (benefit) {
      setEditingBenefit(benefit);
      setFormData(benefit);
    } else {
      setEditingBenefit(null);
      setFormData({
        title: '',
        name: '',
        type: '',
        amount: '',
        description: '',
        targetRecipients: '',
        distributionDate: '',
        birthdayMonth: '',
        status: 'Active'
      });
    }
    setOpenDialog(true);
  };

  // Load benefits from localStorage when component mounts
  useEffect(() => {
    const loadSavedBenefits = () => {
      try {
        const savedBenefits = localStorage.getItem('benefits');
        console.log('Loading benefits from localStorage:', savedBenefits);
        if (savedBenefits && savedBenefits !== 'null' && savedBenefits !== 'undefined') {
          const parsedBenefits = JSON.parse(savedBenefits);
          console.log('Parsed benefits:', parsedBenefits);
          if (Array.isArray(parsedBenefits)) {
            setBenefits(parsedBenefits);
          }
        }
      } catch (error) {
        console.error('Error loading saved benefits:', error);
        // Clear invalid data
        localStorage.removeItem('benefits');
      }
    };
    
    loadSavedBenefits();
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBenefit(null);
  };

  const handleSubmit = () => {
    if (editingBenefit) {
      // Update existing benefit
      const updatedBenefits = benefits.map(benefit => 
        benefit.id === editingBenefit.id 
          ? { 
              ...benefit, 
              name: formData.name,
              type: formData.type,
              amount: formData.amount,
              description: formData.description,
              targetRecipients: formData.targetRecipients,
              status: formData.status
            }
          : benefit
      );
      setBenefits(updatedBenefits);
      // Save to localStorage for BenefitTracking to access
      localStorage.setItem('benefits', JSON.stringify(updatedBenefits));
    } else {
      // Add new benefit
      const newBenefit = {
        id: benefits.length > 0 ? Math.max(...benefits.map(b => b.id), 0) + 1 : 1,
        name: formData.name,
        type: formData.type,
        amount: formData.amount,
        description: formData.description,
        targetRecipients: formData.targetRecipients,
        status: formData.status,
        distributed: 0,
        pending: 0,
        color: getColorForType(formData.type),
        distributionDate: formData.distributionDate,
        birthdayMonth: formData.birthdayMonth
      };
      const updatedBenefits = [...benefits, newBenefit];
      setBenefits(updatedBenefits);
      // Save to localStorage for BenefitTracking to access
      localStorage.setItem('benefits', JSON.stringify(updatedBenefits));
    }
    handleCloseDialog();
  };

  const getColorForType = (type) => {
    const colorMap = {
      'Financial': '#27AE60',
      'Medical': '#3498DB',
      'Educational': '#9B59B6',
      'Transportation': '#F39C12',
      'Emergency': '#E74C3C',
      'Livelihood': '#34495E',
      'Birthday Cash Gift': '#E67E22'
    };
    return colorMap[type] || '#95A5A6';
  };

  const handlePrintBenefit = (benefit) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Benefit Program - ${benefit.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2C3E50;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2C3E50;
              margin: 0;
              font-size: 24px;
            }
            .header h2 {
              color: #7F8C8D;
              margin: 5px 0 0 0;
              font-size: 16px;
              font-weight: normal;
            }
            .benefit-info {
              background: #F8F9FA;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              margin-bottom: 10px;
            }
            .info-label {
              font-weight: bold;
              width: 150px;
              color: #2C3E50;
            }
            .info-value {
              flex: 1;
              color: #555;
            }
            .description {
              background: #FFFFFF;
              padding: 15px;
              border-left: 4px solid ${benefit.color};
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #7F8C8D;
              border-top: 1px solid #E0E0E0;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PWD Benefits Program</h1>
            <h2>City of Cabuyao - Persons with Disability Affairs Office</h2>
          </div>
          
          <div class="benefit-info">
            <div class="info-row">
              <div class="info-label">Program Name:</div>
              <div class="info-value">${benefit.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Type:</div>
              <div class="info-value">${benefit.type}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Amount:</div>
              <div class="info-value">${benefit.amount}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Target Recipients:</div>
              <div class="info-value">${benefit.targetRecipients}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Status:</div>
              <div class="info-value">${benefit.status}</div>
            </div>
            ${benefit.distributionDate ? `
            <div class="info-row">
              <div class="info-label">Distribution Date:</div>
              <div class="info-value">${new Date(benefit.distributionDate).toLocaleDateString()}</div>
            </div>
            ` : ''}
            ${benefit.birthdayMonth ? `
            <div class="info-row">
              <div class="info-label">Birthday Quarter:</div>
              <div class="info-value">${benefit.birthdayMonth}</div>
            </div>
            ` : ''}
          </div>
          
          <div class="description">
            <strong>Description:</strong><br>
            ${benefit.description}
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>City of Cabuyao - Persons with Disability Affairs Office</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const getStatusColor = (status) => {
    return status === 'Distributed' ? 'success' : status === 'Pending' ? 'warning' : 'error';
  };

  const getStatusIcon = (status) => {
    return status === 'Distributed' ? <CheckCircle /> : status === 'Pending' ? <Schedule /> : <Warning />;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F7FC' }}>
      <AdminSidebar />
      
      <Box sx={{ flex: 1, ml: '280px', width: 'calc(100% - 280px)', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #E0E0E0', bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#2C3E50' }}>
              Ayuda & Benefits Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                bgcolor: '#27AE60', 
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': { bgcolor: '#229954' } 
              }}
            >
              + Add New Benefit
            </Button>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ 
                border: '1px solid #E0E0E0', 
                bgcolor: '#FFFFFF',
                borderRadius: 2,
                '&:hover': { 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <AttachMoney sx={{ fontSize: 40, color: '#27AE60', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 1 }}>
                    ₱0
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                    Total Distributed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ 
                border: '1px solid #E0E0E0', 
                bgcolor: '#FFFFFF',
                borderRadius: 2,
                '&:hover': { 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <People sx={{ fontSize: 40, color: '#3498DB', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 1 }}>
                    0
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                    Total Recipients
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ 
                border: '1px solid #E0E0E0', 
                bgcolor: '#FFFFFF',
                borderRadius: 2,
                '&:hover': { 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <LocalShipping sx={{ fontSize: 40, color: '#F39C12', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 1 }}>
                    0
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                    Pending Distribution
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ 
                border: '1px solid #E0E0E0', 
                bgcolor: '#FFFFFF',
                borderRadius: 2,
                '&:hover': { 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <VolunteerActivism sx={{ fontSize: 40, color: '#9B59B6', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 1 }}>
                    0
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                    Active Programs
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Benefits Cards */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2C3E50', fontSize: '1.2rem' }}>
            Available Benefits Programs
          </Typography>
          {benefits.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6, 
              bgcolor: '#F8F9FA', 
              borderRadius: 2, 
              border: '2px dashed #E0E0E0' 
            }}>
              <VolunteerActivism sx={{ fontSize: 60, color: '#BDC3C7', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#7F8C8D', mb: 1, fontWeight: 600 }}>
                No Benefits Programs Available
              </Typography>
              <Typography variant="body2" sx={{ color: '#95A5A6', mb: 3 }}>
                Start by adding your first benefit program to help PWD members
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ 
                  bgcolor: '#27AE60', 
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#229954' } 
                }}
              >
                Add First Benefit Program
              </Button>
            </Box>
          ) : (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {benefits.map((benefit) => (
              <Grid item xs={12} sm={6} md={4} key={benefit.id}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    border: '1px solid #E0E0E0',
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#2C3E50',
                    '&:hover': { 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip 
                        label={benefit.type} 
                        size="small" 
                        sx={{ 
                          bgcolor: `${benefit.color}15`, 
                          color: benefit.color,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handlePrintBenefit(benefit)}
                            sx={{ color: '#FFFFFF', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                            title="Print Benefit"
                          >
                            <Print />
                          </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(benefit)}
                        sx={{ color: '#FFFFFF', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                      >
                        <Edit />
                      </IconButton>
                        </Box>
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: '#FFFFFF', fontSize: '1rem' }}>
                      {benefit.name}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                      {benefit.amount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#E0E0E0', mb: 2, lineHeight: 1.5 }}>
                      {benefit.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#E0E0E0', display: 'block', mb: 2, fontWeight: 500 }}>
                      Target: {benefit.targetRecipients}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#27AE60', fontWeight: 600 }}>
                          Distributed: {benefit.distributed}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#F39C12', fontWeight: 600 }}>
                          Pending: {benefit.pending}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          )}

          {/* Distribution History */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2C3E50', fontSize: '1.2rem' }}>
            Recent Distribution History
          </Typography>
          {distributionHistory.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4, 
              bgcolor: '#F8F9FA', 
              borderRadius: 2, 
              border: '2px dashed #E0E0E0' 
            }}>
              <LocalShipping sx={{ fontSize: 40, color: '#BDC3C7', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#7F8C8D', mb: 1, fontWeight: 600 }}>
                No Distribution History
              </Typography>
              <Typography variant="body2" sx={{ color: '#95A5A6' }}>
                Distribution records will appear here once benefits are distributed
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Benefit</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Recipient</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Barangay</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.9rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {distributionHistory.map((row, index) => (
                    <TableRow key={row.id} sx={{ bgcolor: index % 2 ? '#F8FAFC' : '#FFFFFF' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#2C3E50' }}>{row.benefitName}</TableCell>
                      <TableCell sx={{ color: '#2C3E50' }}>{row.recipient}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#27AE60' }}>{row.amount}</TableCell>
                      <TableCell sx={{ color: '#2C3E50' }}>{row.date}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={getStatusIcon(row.status)}
                          label={row.status} 
                          color={getStatusColor(row.status)} 
                          size="small" 
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#2C3E50' }}>{row.barangay}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          sx={{ 
                            color: '#3498DB', 
                            '&:hover': { bgcolor: '#E8F4FD' } 
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

        {/* Add/Edit Benefit Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }
          }}
        >
          <DialogTitle sx={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: '#2C3E50',
            pb: 3,
            borderBottom: '2px solid #E8F4FD'
          }}>
            {editingBenefit ? 'Edit Benefit Program' : 'Add New Benefit Program'}
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Benefit Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Monthly Financial Assistance"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(44, 62, 80, 0.9)',
                      padding: '0 8px',
                      borderRadius: '4px'
                    },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#3498DB'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#27AE60'
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      padding: '16px 14px',
                      color: '#2C3E50'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Benefit Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Monthly Financial Assistance Program"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(44, 62, 80, 0.9)',
                      padding: '0 8px',
                      borderRadius: '4px'
                    },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#3498DB'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#27AE60'
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      padding: '16px 14px',
                      color: '#2C3E50'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 700, 
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(44, 62, 80, 0.9)',
                    padding: '0 8px',
                    borderRadius: '4px'
                  }}>
                    Type
                  </InputLabel>
                  <Select
                    value={formData.type}
                    label="Type"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    sx={{
                      fontSize: '1rem',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E0E0E0',
                        borderWidth: 2
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3498DB'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#27AE60'
                      },
                      '& .MuiSelect-select': {
                        padding: '16px 14px',
                        fontSize: '1rem',
                        color: '#2C3E50'
                      }
                    }}
                  >
                    <MenuItem value="Financial" sx={{ fontSize: '1rem' }}>Financial</MenuItem>
                    <MenuItem value="Medical" sx={{ fontSize: '1rem' }}>Medical</MenuItem>
                    <MenuItem value="Educational" sx={{ fontSize: '1rem' }}>Educational</MenuItem>
                    <MenuItem value="Transportation" sx={{ fontSize: '1rem' }}>Transportation</MenuItem>
                    <MenuItem value="Emergency" sx={{ fontSize: '1rem' }}>Emergency</MenuItem>
                    <MenuItem value="Livelihood" sx={{ fontSize: '1rem' }}>Livelihood</MenuItem>
                    <MenuItem value="Birthday Cash Gift" sx={{ fontSize: '1rem' }}>Birthday Cash Gift</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g., ₱1,500"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(44, 62, 80, 0.9)',
                      padding: '0 8px',
                      borderRadius: '4px'
                    },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#3498DB'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#27AE60'
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      padding: '16px 14px',
                      color: '#2C3E50'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Distribution Date"
                  type="date"
                  value={formData.distributionDate}
                  onChange={(e) => setFormData({ ...formData, distributionDate: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(44, 62, 80, 0.9)',
                      padding: '0 8px',
                      borderRadius: '4px'
                    },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#3498DB'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#27AE60'
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      padding: '16px 14px',
                      color: '#2C3E50'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={4}
                  placeholder="Describe the benefit program, eligibility criteria, and how it helps PWD members..."
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(44, 62, 80, 0.9)',
                      padding: '0 8px',
                      borderRadius: '4px'
                    },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#3498DB'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#27AE60'
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      padding: '16px 14px',
                      lineHeight: 1.5,
                      color: '#2C3E50'
                    }
                  }}
                />
              </Grid>
              {formData.type === 'Birthday Cash Gift' && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700, 
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(44, 62, 80, 0.9)',
                      padding: '0 8px',
                      borderRadius: '4px'
                    }}>
                      Birthday Month Quarter
                    </InputLabel>
                    <Select
                      value={formData.birthdayMonth}
                      label="Birthday Month Quarter"
                      onChange={(e) => setFormData({ ...formData, birthdayMonth: e.target.value })}
                      sx={{
                        fontSize: '1rem',
                        borderRadius: 2,
                        backgroundColor: '#FFFFFF',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E0E0E0',
                          borderWidth: 2
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3498DB'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#27AE60'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 14px',
                          fontSize: '1rem',
                          color: '#2C3E50'
                        }
                      }}
                    >
                      <MenuItem value="Q1" sx={{ fontSize: '1rem' }}>Q1 - January, February, March</MenuItem>
                      <MenuItem value="Q2" sx={{ fontSize: '1rem' }}>Q2 - April, May, June</MenuItem>
                      <MenuItem value="Q3" sx={{ fontSize: '1rem' }}>Q3 - July, August, September</MenuItem>
                      <MenuItem value="Q4" sx={{ fontSize: '1rem' }}>Q4 - October, November, December</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target Recipients"
                  value={formData.targetRecipients}
                  onChange={(e) => setFormData({ ...formData, targetRecipients: e.target.value })}
                  placeholder="e.g., All Registered PWDs, PWDs with Medical Needs, PWD Students"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(44, 62, 80, 0.9)',
                      padding: '0 8px',
                      borderRadius: '4px'
                    },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#3498DB'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#27AE60'
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      padding: '16px 14px',
                      color: '#2C3E50'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 700, 
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(44, 62, 80, 0.9)',
                    padding: '0 8px',
                    borderRadius: '4px'
                  }}>
                    Status
                  </InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    sx={{
                      fontSize: '1rem',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E0E0E0',
                        borderWidth: 2
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3498DB'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#27AE60'
                      },
                      '& .MuiSelect-select': {
                        padding: '16px 14px',
                        fontSize: '1rem',
                        color: '#2C3E50'
                      }
                    }}
                  >
                    <MenuItem value="Active" sx={{ fontSize: '1rem' }}>Active</MenuItem>
                    <MenuItem value="Inactive" sx={{ fontSize: '1rem' }}>Inactive</MenuItem>
                    <MenuItem value="Suspended" sx={{ fontSize: '1rem' }}>Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ 
            p: 4, 
            pt: 2, 
            borderTop: '2px solid #E8F4FD',
            bgcolor: '#F8FAFC',
            gap: 2
          }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                color: '#7F8C8D',
                border: '2px solid #E0E0E0',
                '&:hover': { 
                  bgcolor: '#E8F4FD',
                  color: '#2C3E50',
                  borderColor: '#3498DB'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                bgcolor: '#27AE60',
                '&:hover': { 
                  bgcolor: '#229954' 
                }
              }}
            >
              {editingBenefit ? 'Update Benefit' : 'Add Benefit'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  </Box>
  );
};

export default Ayuda;
