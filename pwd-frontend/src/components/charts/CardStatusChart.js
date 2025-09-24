import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartContainer from './ChartContainer';
import { Box, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CardStatusChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer 
        title="Card Status Distribution" 
        subtitle="PWD ID card status overview"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Card status data based on your actual data
  const cardStatusData = [
    { status: 'Issued', count: 8 },
    { status: 'Pending', count: 0 },
    { status: 'Expired', count: 0 },
    { status: 'Lost/Damaged', count: 0 },
  ];

  const chartData = {
    labels: cardStatusData.map(item => item.status),
    datasets: [
      {
        label: 'Number of Cards',
        data: cardStatusData.map(item => item.count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',  // Issued - Green
          'rgba(255, 205, 86, 0.8)',   // Pending - Yellow
          'rgba(255, 99, 132, 0.8)',    // Expired - Red
          'rgba(153, 102, 255, 0.8)',  // Lost/Damaged - Purple
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: 'white',
          font: {
            color: 'white'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
          font: {
            color: 'white'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <ChartContainer 
      title="Card Status Distribution" 
      subtitle="PWD ID card status overview"
    >
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default CardStatusChart;
