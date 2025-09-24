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

const ComplaintStatusChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer 
        title="Complaint Status Overview" 
        subtitle="Current status of complaints"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No complaints data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Complaint status data - currently showing zero complaints
  const complaintStatusData = [
    { status: 'Open', count: 0 },
    { status: 'In Progress', count: 0 },
    { status: 'Resolved', count: 0 },
    { status: 'Closed', count: 0 },
  ];

  const chartData = {
    labels: complaintStatusData.map(item => item.status),
    datasets: [
      {
        label: 'Number of Complaints',
        data: complaintStatusData.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',    // Open - Red
          'rgba(255, 205, 86, 0.8)',    // In Progress - Yellow
          'rgba(75, 192, 192, 0.8)',    // Resolved - Green
          'rgba(153, 102, 255, 0.8)',   // Closed - Purple
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
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
            return `${context.label}: ${context.parsed} complaints`;
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
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <ChartContainer 
      title="Complaint Status Overview" 
      subtitle="Current status of complaints"
    >
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default ComplaintStatusChart;
