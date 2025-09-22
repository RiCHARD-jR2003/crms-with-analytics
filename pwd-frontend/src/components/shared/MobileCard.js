// src/components/shared/MobileCard.js
import React from 'react';
import { Card, CardContent, CardActions, useMediaQuery, useTheme } from '@mui/material';

const MobileCard = ({ 
  children, 
  actions,
  padding = '16px',
  mobilePadding = '12px',
  elevation = 1,
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card
      elevation={elevation}
      sx={{
        borderRadius: isMobile ? 2 : 1,
        margin: isMobile ? '8px' : 'inherit',
        // Touch-friendly hover effects
        '&:hover': {
          transform: isMobile ? 'none' : 'translateY(-2px)',
          boxShadow: isMobile ? 'inherit' : 4,
          transition: isMobile ? 'none' : 'all 0.3s ease',
        },
        // Prevent text selection on mobile
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ...props.sx
      }}
      {...props}
    >
      <CardContent sx={{ 
        padding: isMobile ? mobilePadding : padding,
        '&:last-child': {
          paddingBottom: isMobile ? mobilePadding : padding,
        }
      }}>
        {children}
      </CardContent>
      {actions && (
        <CardActions sx={{ 
          padding: isMobile ? '8px 12px' : '16px',
          paddingTop: 0
        }}>
          {actions}
        </CardActions>
      )}
    </Card>
  );
};

export default MobileCard;
