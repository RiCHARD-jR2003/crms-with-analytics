import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartContainer from './ChartContainer';
import { Box, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const BenefitTypeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer 
        title="Benefit Type Distribution" 
        subtitle="Distribution of benefits by type"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Benefit type data - currently showing zero claims
  const benefitTypeData = [
    { type: 'Medical Assistance', count: 0 },
    { type: 'Educational Support', count: 0 },
    { type: 'Transportation', count: 0 },
    { type: 'Financial Aid', count: 0 },
    { type: 'Equipment Support', count: 0 },
  ];

  const colors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
  ];

  const chartData = {
    labels: benefitTypeData.map(item => item.type),
    datasets: [
      {
        data: benefitTypeData.map(item => item.count),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: 'white',
          font: {
            color: 'white'
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed} claims`;
          },
        },
      },
    },
  };

  return (
    <ChartContainer 
      title="Benefit Type Distribution" 
      subtitle="Distribution of benefits by type"
    >
      <Pie data={chartData} options={options} />
    </ChartContainer>
  );
};

export default BenefitTypeChart;
