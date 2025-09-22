// src/components/shared/MobileCamera.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert,
  useMediaQuery,
  useTheme,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { 
  CameraAlt, 
  Close, 
  FlashOn, 
  FlashOff,
  FlipCameraIos,
  PhotoCamera 
} from '@mui/icons-material';

const MobileCamera = ({ 
  onCapture, 
  onError,
  onClose,
  open = false,
  title = "Take Photo",
  aspectRatio = '4:3'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open, facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: aspectRatio === '4:3' ? 4/3 : 16/9
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Check if flash is available
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      if (capabilities.torch) {
        setHasFlash(true);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message);
      onError?.(err);
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture?.(file);
        stopCamera();
        onClose?.();
      }
    }, 'image/jpeg', 0.8);
  };

  const toggleFlash = async () => {
    if (streamRef.current && hasFlash) {
      try {
        const track = streamRef.current.getVideoTracks()[0];
        await track.applyConstraints({
          advanced: [{ torch: !flashOn }]
        });
        setFlashOn(!flashOn);
      } catch (err) {
        console.error('Flash toggle error:', err);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };

  const handleClose = () => {
    stopCamera();
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : 2,
          margin: isMobile ? 0 : '32px',
          maxHeight: isMobile ? '100vh' : 'calc(100vh - 64px)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          height: isMobile ? 'calc(100vh - 200px)' : '400px',
          backgroundColor: '#000',
          borderRadius: isMobile ? 0 : 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isLoading && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              color: 'white'
            }}>
              <CircularProgress color="inherit" />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Starting camera...
              </Typography>
            </Box>
          )}

          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isLoading ? 'none' : 'block'
            }}
            playsInline
            muted
          />

          {/* Hidden canvas for photo capture */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />

          {/* Camera Controls */}
          <Box sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            {/* Flash Toggle */}
            {hasFlash && (
              <IconButton
                onClick={toggleFlash}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  }
                }}
              >
                {flashOn ? <FlashOff /> : <FlashOn />}
              </IconButton>
            )}

            {/* Camera Flip */}
            <IconButton
              onClick={toggleCamera}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }
              }}
            >
              <FlipCameraIos />
            </IconButton>
          </Box>

          {/* Capture Button */}
          <Box sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Button
              onClick={capturePhoto}
              disabled={isLoading}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'white',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.5)',
                }
              }}
            >
              <PhotoCamera sx={{ fontSize: 32 }} />
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<Close />}
          sx={{ minWidth: 120 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileCamera;
