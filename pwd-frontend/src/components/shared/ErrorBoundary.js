// src/components/shared/ErrorBoundary.js
import React from 'react';
import { Box, Typography, Button, Card, CardContent, Alert } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          p: 3
        }}>
          <Card sx={{ 
            maxWidth: 600, 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <ErrorIcon sx={{ 
                fontSize: 64, 
                color: '#E74C3C', 
                mb: 2 
              }} />
              
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: '#2C3E50',
                mb: 2
              }}>
                Something went wrong
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: '#7F8C8D',
                mb: 3
              }}>
                We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
              </Typography>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Error Details (Development Mode):
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {this.state.error.toString()}
                  </Typography>
                  {this.state.errorInfo && (
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', mt: 1 }}>
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  )}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRetry}
                  sx={{
                    backgroundColor: '#3498DB',
                    '&:hover': {
                      backgroundColor: '#2980B9'
                    }
                  }}
                >
                  Try Again
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                  sx={{
                    borderColor: '#3498DB',
                    color: '#3498DB',
                    '&:hover': {
                      borderColor: '#2980B9',
                      backgroundColor: 'rgba(52, 152, 219, 0.1)'
                    }
                  }}
                >
                  Refresh Page
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
