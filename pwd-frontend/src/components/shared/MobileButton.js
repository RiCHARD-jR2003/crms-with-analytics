// src/components/shared/MobileButton.js
import React from 'react';
import { Button, useMediaQuery, useTheme } from '@mui/material';

const MobileButton = ({ 
  children, 
  variant = 'contained', 
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  minHeight = 48,
  fontSize = '1rem',
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      sx={{
        minHeight: isMobile ? minHeight : 'auto',
        fontSize: isMobile ? fontSize : 'inherit',
        padding: isMobile ? '12px 24px' : 'inherit',
        borderRadius: isMobile ? 2 : 'inherit',
        textTransform: 'none',
        fontWeight: 600,
        // Touch-friendly styles
        '&:active': {
          transform: isMobile ? 'scale(0.98)' : 'none',
          transition: 'transform 0.1s ease-in-out',
        },
        // Prevent text selection on mobile
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MobileButton;
