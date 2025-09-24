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

  // Use the actual data passed to the component
  const colors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(199, 199, 199, 0.8)',
    'rgba(83, 102, 255, 0.8)',
  ];

  const chartData = {
    labels: data.map(item => item.disability || item.type),
    datasets: [
      {
        data: data.map(item => item.count || 0),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map(color => color.replace('0.8', '1')),
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
            const total = context.dataset.data.reduce((a, b) => a + (b || 0), 0);
            const value = context.parsed || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${context.label}: ${value} (${percentage}%)`;
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
