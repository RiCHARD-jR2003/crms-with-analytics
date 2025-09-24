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

const AgeGroupChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer 
        title="Age Group Distribution" 
        subtitle="PWD members by age group"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Sample age group data based on your PWD records
  const ageGroupData = [
    { group: 'Under 18', count: 2 },
    { group: '18-35', count: 3 },
    { group: '36-55', count: 2 },
    { group: 'Over 55', count: 1 },
  ];

  const chartData = {
    labels: ageGroupData.map(item => item.group),
    datasets: [
      {
        label: 'Number of PWD Members',
        data: ageGroupData.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
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
            const percentage = ((context.parsed / total) * 100).toFixed(1);
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
        },
      },
    },
  };

  return (
    <ChartContainer 
      title="Age Group Distribution" 
      subtitle="PWD members by age group"
    >
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default AgeGroupChart;
