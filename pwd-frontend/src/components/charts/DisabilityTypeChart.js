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

const DisabilityTypeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer 
        title="Disability Type Distribution" 
        subtitle="Distribution of PWD members by disability type"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Sample disability data - you can replace this with real data from your API
  const disabilityData = [
    { type: 'Physical', count: 3 },
    { type: 'Mental', count: 2 },
    { type: 'Intellectual', count: 1 },
    { type: 'Hearing', count: 1 },
    { type: 'Visual', count: 1 },
  ];

  const colors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
  ];

  const chartData = {
    labels: disabilityData.map(item => item.type),
    datasets: [
      {
        data: disabilityData.map(item => item.count),
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
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartContainer 
      title="Disability Type Distribution" 
      subtitle="Distribution of PWD members by disability type"
    >
      <Pie data={chartData} options={options} />
    </ChartContainer>
  );
};

export default DisabilityTypeChart;
