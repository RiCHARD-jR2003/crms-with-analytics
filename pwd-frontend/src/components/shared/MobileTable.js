// src/components/shared/MobileTable.js
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  useMediaQuery,
  useTheme,
  Box,
  Typography
} from '@mui/material';

const MobileTable = ({ 
  columns = [], 
  data = [], 
  mobileBreakpoint = 'sm',
  showMobileCard = true,
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(mobileBreakpoint));

  if (isMobile && showMobileCard) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((row, index) => (
          <Paper 
            key={index} 
            elevation={1} 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}
          >
            {columns.map((column) => (
              <Box key={column.key} sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
                <Typography variant="caption" sx={{ 
                  fontWeight: 600, 
                  color: '#666',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {column.label}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#000',
                  fontSize: '0.9rem',
                  mt: 0.5
                }}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </Typography>
              </Box>
            ))}
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: isMobile ? 2 : 1,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <Table 
        sx={{ 
          minWidth: isMobile ? 600 : 'auto',
          '& .MuiTableCell-root': {
            padding: isMobile ? '8px 4px' : '16px',
            fontSize: isMobile ? '0.8rem' : 'inherit',
            borderBottom: '1px solid #e0e0e0'
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            fontWeight: 600,
            backgroundColor: '#f5f5f5',
            fontSize: isMobile ? '0.75rem' : 'inherit'
          }
        }}
        {...props}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MobileTable;
