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
import { Box, Typography } from '@mui/material';
import ChartContainer from './ChartContainer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarangayPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer 
        title="Barangay Performance Overview" 
        subtitle="PWD registrations by barangay"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Sort data by registered count (descending)
  const sortedData = [...data].sort((a, b) => b.registered - a.registered);
  
  const chartData = {
    labels: sortedData.map(item => item.barangay),
    datasets: [
      {
        label: 'Registered PWDs',
        data: sortedData.map(item => item.registered),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Cards Issued',
        data: sortedData.map(item => item.cards),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Benefits Distributed',
        data: sortedData.map(item => item.benefits),
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <ChartContainer 
      title="Barangay Performance Overview" 
      subtitle="PWD registrations, cards issued, and benefits distributed by barangay"
    >
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default BarangayPerformanceChart;
