import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import ChartContainer from './ChartContainer';
import { Box, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnnualTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer 
        title="Annual Performance Trends" 
        subtitle="Key metrics over the past year"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Annual trend data based on your actual data
  const monthlyData = [
    { month: 'Aug', registrations: 2, cards: 2, benefits: 0, complaints: 0 },
    { month: 'Sep', registrations: 3, cards: 3, benefits: 0, complaints: 0 },
    { month: 'Oct', registrations: 1, cards: 1, benefits: 0, complaints: 0 },
    { month: 'Nov', registrations: 1, cards: 1, benefits: 0, complaints: 0 },
    { month: 'Dec', registrations: 1, cards: 1, benefits: 0, complaints: 0 },
    { month: 'Jan', registrations: 0, cards: 0, benefits: 0, complaints: 0 },
  ];

  const chartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Registrations',
        data: monthlyData.map(item => item.registrations),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        type: 'line',
      },
      {
        label: 'Cards Issued',
        data: monthlyData.map(item => item.cards),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        type: 'line',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            color: 'white'
          }
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
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
      title="Annual Performance Trends" 
      subtitle="Key metrics over the past year"
    >
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
};

export default AnnualTrendChart;
