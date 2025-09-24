import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ChartContainer = ({ title, subtitle, children, height = 400 }) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2, backgroundColor: '#2C3E50' }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#BDC3C7', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ height: height, position: 'relative' }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
