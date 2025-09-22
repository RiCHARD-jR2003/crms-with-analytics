// src/components/shared/MobileFormField.js
import React from 'react';
import { TextField, useMediaQuery, useTheme } from '@mui/material';

const MobileFormField = ({ 
  label,
  type = 'text',
  fullWidth = true,
  margin = 'normal',
  variant = 'outlined',
  fontSize = '16px', // Prevent zoom on iOS
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <TextField
      label={label}
      type={type}
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
      sx={{
        '& .MuiInputBase-root': {
          fontSize: isMobile ? fontSize : 'inherit',
          minHeight: isMobile ? '48px' : 'auto',
        },
        '& .MuiInputLabel-root': {
          fontSize: isMobile ? '0.9rem' : 'inherit',
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: isMobile ? 2 : 'inherit',
        },
        // Prevent zoom on iOS
        '& input': {
          fontSize: isMobile ? fontSize : 'inherit',
        },
        marginBottom: isMobile ? '16px' : 'inherit',
        ...props.sx
      }}
      {...props}
    />
  );
};

export default MobileFormField;
