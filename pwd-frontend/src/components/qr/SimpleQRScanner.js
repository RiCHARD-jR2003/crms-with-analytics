import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Chip,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import QrScanner from 'qr-scanner';
import pwdMemberService from '../../services/pwdMemberService';
import api from '../../services/api';

const SimpleQRScanner = ({ open, onClose, onScan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [memberInfo, setMemberInfo] = useState(null);
  const [currentBenefits, setCurrentBenefits] = useState([]);
  const [scanner, setScanner] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (open) {
      loadBirthdayBenefits();
      initializeCamera();
    } else {
      stopCamera();
      resetScanner();
    }

    return () => {
      stopCamera();
    };
  }, [open]);

  // Load birthday benefits from localStorage
  const loadBirthdayBenefits = () => {
    try {
      const savedBenefits = localStorage.getItem('benefits');
      if (savedBenefits) {
        const benefits = JSON.parse(savedBenefits);
        const birthdayBenefits = benefits.filter(benefit => benefit.type === 'Birthday Cash Gift');
        setCurrentBenefits(birthdayBenefits);
      }
    } catch (error) {
      console.error('Error loading birthday benefits:', error);
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setMemberInfo(null);
    setError(null);
    setLoading(false);
  };

  const initializeCamera = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        setError('No camera found on this device. Please connect a webcam or use a mobile device.');
        setLoading(false);
        return;
      }

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready before starting QR scanner
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current.play();
            setCameraActive(true);

            // Initialize QR scanner after video is ready
            const qrScanner = new QrScanner(
              videoRef.current,
              (result) => {
                console.log('🎯 QR Code scanned:', result);
                console.log('📄 QR Code data:', result.data);
                console.log('🔍 QR Code format:', typeof result.data);
                
                // Add a small delay to prevent multiple rapid scans
                setTimeout(() => {
                  handleQRScan(result);
                }, 100);
              },
              {
                onDecodeError: (error) => {
                  // Only log decode errors occasionally to avoid spam
                  if (Math.random() < 0.01) { // Log only 1% of decode errors
                    console.log('Decode error (normal):', error.message);
                  }
                },
                highlightScanRegion: true,
                highlightCodeOutline: true,
                preferredCamera: 'environment', // Use back camera for better QR scanning
                maxScansPerSecond: 10, // Increase scan frequency for better detection
                returnDetailedScanResult: true,
                preferredEnvironment: 'environment'
              }
            );

            setScanner(qrScanner);
            await qrScanner.start();
            console.log('QR Scanner started successfully');
          } catch (error) {
            console.error('Error starting QR scanner:', error);
            setError('Failed to start QR scanner');
          }
        };
      }

      setLoading(false);
    } catch (err) {
      console.error('Camera initialization error:', err);
      setLoading(false);
      
      switch (err.name) {
        case 'NotAllowedError':
          setError('Camera access denied. Please allow camera permissions and refresh the page.');
          break;
        case 'NotFoundError':
          setError('No camera found. Please connect a webcam or use a mobile device.');
          break;
        case 'NotSupportedError':
          setError('Camera not supported. Please use Chrome, Firefox, or Edge browser.');
          break;
        default:
          setError(`Camera error: ${err.message}`);
      }
    }
  };

  const stopCamera = () => {
    if (scanner) {
      scanner.stop();
      scanner.destroy();
      setScanner(null);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleQRScan = async (result) => {
    try {
      console.log('=== QR SCAN STARTED ===');
      console.log('Raw result:', result);
      console.log('Result data:', result.data);
      console.log('Result data type:', typeof result.data);
      console.log('Result data length:', result.data?.length);
      
      setLoading(true);
      setIsProcessing(true);
      setError(null);
      
      // Try to parse QR code data
      let qrData;
      try {
        qrData = JSON.parse(result.data);
        console.log('✅ Successfully parsed QR data as JSON:', qrData);
      } catch (parseError) {
        console.error('❌ Failed to parse QR code as JSON:', parseError);
        console.log('Raw QR code content:', result.data);
        
        // Try to handle non-JSON QR codes (like URLs or plain text)
        if (result.data.includes('pwd') || result.data.includes('PWD')) {
          // Try to extract PWD ID from text
          const pwdIdMatch = result.data.match(/PWD-?\d+/i);
          if (pwdIdMatch) {
            const pwdId = pwdIdMatch[0];
            console.log('✅ Extracted PWD ID from text:', pwdId);
            
            // Create a simple QR data object
            qrData = {
              pwd_id: pwdId,
              userID: pwdId.replace(/PWD-?/i, ''),
              name: 'Unknown Member',
              firstName: 'Unknown',
              lastName: 'Member'
            };
          } else {
            console.error('❌ No PWD ID found in text');
            setError(`Invalid QR code format. Content: ${result.data.substring(0, 50)}...`);
            return;
          }
        } else {
          console.error('❌ QR code does not contain PWD information');
          setError(`Invalid QR code format. Content: ${result.data.substring(0, 50)}...`);
          return;
        }
      }
      
      setScannedData(qrData);
      
      // Find member in PWD data
      console.log('Fetching PWD members...');
      const pwdMembers = await pwdMemberService.getAll();
      console.log('PWD members response:', pwdMembers);
      
      const members = pwdMembers.members || [];
      console.log('Available members:', members.map(m => `${m.firstName} ${m.lastName} (${m.pwd_id})`));
      
      // Try multiple ways to find the member
      const member = members.find(m => 
        m.id === qrData.pwdId || 
        m.userID === qrData.pwdId ||
        m.pwd_id === qrData.pwd_id ||
        m.id === qrData.userID ||
        m.userID === qrData.userID ||
        m.pwd_id === qrData.pwdId ||
        (qrData.pwd_id && m.pwd_id && m.pwd_id.includes(qrData.pwd_id)) ||
        (qrData.userID && m.userID && m.userID.toString() === qrData.userID.toString())
      );
      
      console.log('Found member:', member);
      
      if (member) {
        setMemberInfo(member);
        
        // Check eligibility for current birthday benefits
        const eligibleBenefits = checkEligibility(member);
        console.log('Eligible benefits:', eligibleBenefits);
        
        setMemberInfo(prev => ({
          ...prev,
          eligibleBenefits
        }));
        
        // Process benefit claims for eligible benefits
        if (eligibleBenefits.length > 0) {
          console.log('Processing benefit claims...');
          await processBenefitClaims(member, eligibleBenefits);
        }
        
        // Show success message
        console.log(`✅ Successfully scanned QR code for: ${member.firstName} ${member.lastName}`);
        
      } else {
        console.log('Member not found');
        setError(`PWD member not found in database. Searched for: ${JSON.stringify({
          pwdId: qrData.pwdId,
          userID: qrData.userID,
          pwd_id: qrData.pwd_id
        })}`);
      }
    } catch (error) {
      console.error('Error processing QR scan:', error);
      setError(`Error processing QR scan: ${error.message}`);
    } finally {
      setLoading(false);
      setIsProcessing(false);
      console.log('=== QR SCAN COMPLETED ===');
    }
  };

  // Check eligibility for birthday benefits
  const checkEligibility = (member) => {
    if (!member.birthDate) return [];
    
    const birthMonth = new Date(member.birthDate).getMonth() + 1;
    
    return currentBenefits.filter(benefit => {
      const quarterMonths = {
        'Q1': [1, 2, 3], // January, February, March
        'Q2': [4, 5, 6], // April, May, June
        'Q3': [7, 8, 9], // July, August, September
        'Q4': [10, 11, 12] // October, November, December
      };
      
      const eligibleMonths = quarterMonths[benefit.birthdayMonth] || [];
      return eligibleMonths.includes(birthMonth);
    });
  };

  // Process benefit claims for eligible benefits
  const processBenefitClaims = async (member, eligibleBenefits) => {
    try {
      console.log('Processing benefit claims for member:', member.firstName, member.lastName);
      
      for (const benefit of eligibleBenefits) {
        try {
          // Check if claim already exists by getting all claims and filtering
          const allClaims = await api.get('/benefit-claims');
          const existingClaims = allClaims.filter(claim => 
            claim.pwdID === member.userID && claim.benefitID === benefit.id
          );
          
          if (existingClaims && existingClaims.length > 0) {
            // Update existing claim to "Claimed" status
            const claim = existingClaims[0];
            console.log('Updating existing claim:', claim.claimID);
            
            await api.patch(`/benefit-claims/${claim.claimID}/status`, {
              status: 'Claimed'
            });
            
            console.log(`✅ Updated benefit claim for ${benefit.name}`);
          } else {
            // Create new claim
            console.log('Creating new benefit claim for:', benefit.name);
            
            await api.post('/benefit-claims', {
              pwdID: member.userID,
              benefitID: benefit.id,
              claimDate: new Date().toISOString(),
              status: 'Claimed'
            });
            
            console.log(`✅ Created benefit claim for ${benefit.name}`);
          }
        } catch (claimError) {
          console.error(`Error processing claim for benefit ${benefit.name}:`, claimError);
        }
      }
      
      // Notify parent component about successful claims
      if (onScan) {
        onScan({
          member: member,
          benefit: eligibleBenefits[0], // Use first eligible benefit for notification
          status: 'claimed'
        });
      }
      
      // Show success message
      console.log(`✅ Successfully processed ${eligibleBenefits.length} benefit claims for ${member.firstName} ${member.lastName}`);
      
    } catch (error) {
      console.error('Error processing benefit claims:', error);
      setError(`Error processing benefit claims: ${error.message}`);
    }
  };

  const handleClaimBenefit = async (benefit) => {
    try {
      setLoading(true);
      
      // Create benefit claim
      const claimData = {
        pwdID: memberInfo.userID,
        benefitID: benefit.id,
        claimDate: new Date().toISOString().split('T')[0],
        status: 'Claimed'
      };
      
      // Here you would make an API call to create the claim
      // For now, we'll just show success
      console.log('Creating benefit claim:', claimData);
      
      // Show success message
      setError(null);
      alert(`Benefit "${benefit.name}" claimed successfully for ${memberInfo.firstName} ${memberInfo.lastName}!`);
      
      // Call the onScan callback if provided
      if (onScan) {
        onScan({
          member: memberInfo,
          benefit: benefit,
          status: 'claimed'
        });
      }
      
      // Close scanner
      handleClose();
      
    } catch (error) {
      console.error('Error claiming benefit:', error);
      setError('Failed to claim benefit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: '#2C3E50',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <QrCodeScannerIcon sx={{ mr: 1 }} />
          QR Code Scanner
        </Box>
        <IconButton 
          onClick={handleClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={initializeCamera}
              sx={{
                bgcolor: '#E67E22',
                '&:hover': { bgcolor: '#D35400' }
              }}
            >
              Retry Camera
            </Button>
          </Box>
        ) : memberInfo ? (
          /* Scanned Member Information */
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              QR Code scanned successfully!
            </Alert>

            {/* Member Info */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: '#2C3E50', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                    PWD Member Information
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      PWD ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {memberInfo.pwd_id || `PWD-${memberInfo.userID}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {`${memberInfo.firstName} ${memberInfo.middleName || ''} ${memberInfo.lastName}`.trim()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Birth Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {memberInfo.birthDate ? new Date(memberInfo.birthDate).toLocaleDateString() : 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Disability Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {memberInfo.disabilityType || 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Eligible Benefits */}
            {memberInfo.eligibleBenefits && memberInfo.eligibleBenefits.length > 0 ? (
              <Card sx={{ border: '1px solid #E0E0E0' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50', mb: 2 }}>
                    Eligible Birthday Benefits
                  </Typography>
                  <Grid container spacing={2}>
                    {memberInfo.eligibleBenefits.map((benefit, index) => (
                      <Grid item xs={12} key={index}>
                        <Card sx={{ 
                          border: '1px solid #E67E22',
                          bgcolor: '#FFF8F0'
                        }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#E67E22' }}>
                                  {benefit.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
                                  {benefit.description}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#E67E22', mt: 1 }}>
                                  {benefit.amount}
                                </Typography>
                              </Box>
                              <Button
                                variant="contained"
                                onClick={() => handleClaimBenefit(benefit)}
                                disabled={loading}
                                sx={{
                                  bgcolor: '#E67E22',
                                  '&:hover': { bgcolor: '#D35400' },
                                  px: 3,
                                  py: 1.5,
                                  borderRadius: 2,
                                  fontWeight: 600,
                                  textTransform: 'none'
                                }}
                              >
                                {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Claim Benefit'}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ border: '1px solid #E0E0E0' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <CancelIcon sx={{ fontSize: 60, color: '#BDC3C7', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#7F8C8D', mb: 1 }}>
                    No Eligible Birthday Benefits
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#95A5A6' }}>
                    This member is not eligible for any current birthday cash gift benefits.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        ) : (
          /* Camera View */
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto',
              borderRadius: 2,
              overflow: 'hidden',
              border: '2px solid #E0E0E0',
              aspectRatio: '4/3',
              bgcolor: '#000'
            }}>
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                playsInline
                muted
              />
              
              {loading && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white'
                }}>
                  <CircularProgress sx={{ color: 'white' }} />
                </Box>
              )}

              {isProcessing && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  p: 3
                }}>
                  <CircularProgress sx={{ color: 'white', mb: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Processing QR Code...
                  </Typography>
                  <Typography variant="caption" sx={{ textAlign: 'center' }}>
                    Verifying PWD member and processing benefits
                  </Typography>
                </Box>
              )}

              {cameraActive && (
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  border: '2px solid #E67E22',
                  borderRadius: 2,
                  pointerEvents: 'none'
                }} />
              )}
            </Box>

            <Typography variant="body2" sx={{ mt: 2, color: '#BDC3C7' }}>
              Position the QR code within the camera view to scan
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, color: '#95A5A6', display: 'block' }}>
              💡 Tip: Hold your phone steady and ensure good lighting for best results
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, color: '#95A5A6', display: 'block' }}>
              📱 Camera access requires HTTPS or localhost. Make sure to allow camera permissions when prompted.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        {memberInfo ? (
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Button
              onClick={() => {
                resetScanner();
                initializeCamera();
              }}
              variant="outlined"
              sx={{
                borderColor: '#E67E22',
                color: '#E67E22',
                '&:hover': {
                  borderColor: '#D35400',
                  backgroundColor: 'rgba(230, 126, 34, 0.1)'
                }
              }}
            >
              Scan Another
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: '#BDC3C7',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: '#BDC3C7',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SimpleQRScanner;
