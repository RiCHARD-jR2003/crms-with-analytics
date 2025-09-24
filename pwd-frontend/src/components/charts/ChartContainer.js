import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ChartContainer = ({ title, subtitle, children, height = 400 }) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#7F8C8D', mt: 0.5 }}>
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
