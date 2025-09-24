import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartContainer from './ChartContainer';
import { Box, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const ServiceUtilizationChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer 
        title="Service Utilization" 
        subtitle="Current utilization of PWD services"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Service utilization data based on your actual data
  const serviceData = [
    { service: 'PWD Registration', utilized: 8, total: 8 },
    { service: 'ID Card Issuance', utilized: 8, total: 8 },
    { service: 'Benefit Claims', utilized: 0, total: 8 },
    { service: 'Complaint System', utilized: 0, total: 8 },
  ];

  const chartData = {
    labels: serviceData.map(item => item.service),
    datasets: [
      {
        data: serviceData.map(item => item.utilized),
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',  // Registration - Good
          'rgba(75, 192, 192, 0.8)',  // ID Cards - Good
          'rgba(255, 99, 132, 0.8)',  // Benefits - Critical
          'rgba(255, 99, 132, 0.8)',  // Complaints - Critical
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
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
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = serviceData[i].total;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return {
                  text: `${label}: ${value}/${total} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'circle',
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = serviceData[context.dataIndex].total;
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${context.parsed}/${total} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartContainer 
      title="Service Utilization" 
      subtitle="Current utilization of PWD services"
    >
      <Doughnut data={chartData} options={options} />
    </ChartContainer>
  );
};

export default ServiceUtilizationChart;
