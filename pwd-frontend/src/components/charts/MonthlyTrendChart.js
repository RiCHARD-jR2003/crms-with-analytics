import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartContainer from './ChartContainer';
import { Box, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer 
        title="Monthly Registration Trend" 
        subtitle="PWD registrations over the last 6 months"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Sample monthly data - you can replace this with real data from your API
  const monthlyData = [
    { month: 'Aug 2024', registrations: 2 },
    { month: 'Sep 2024', registrations: 3 },
    { month: 'Oct 2024', registrations: 1 },
    { month: 'Nov 2024', registrations: 1 },
    { month: 'Dec 2024', registrations: 1 },
    { month: 'Jan 2025', registrations: 0 },
  ];

  const chartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'New Registrations',
        data: monthlyData.map(item => item.registrations),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
        mode: 'index',
        intersect: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `New Registrations: ${context.parsed.y}`;
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
          color: 'rgba(0, 0, 0, 0.1)',
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
          display: false,
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
      title="Monthly Registration Trend" 
      subtitle="PWD registrations over the last 6 months"
    >
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
};

export default MonthlyTrendChart;
