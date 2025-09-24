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
  if (!data || !data.totalRegistrations) {
    return (
      <ChartContainer 
        title="Service Utilization" 
        subtitle="Current utilization of PWD services"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            No service data available
          </Typography>
        </Box>
      </ChartContainer>
    );
  }

  // Calculate service utilization based on actual data
  const totalMembers = data.totalRegistrations || 0;
  const cardsIssued = data.totalCardsIssued || 0;
  const benefitsDistributed = data.totalBenefitsDistributed || 0;
  const complaintsReceived = data.totalComplaints || 0;

  const serviceData = [
    { 
      service: 'PWD Registration', 
      utilized: totalMembers, 
      total: totalMembers,
      percentage: totalMembers > 0 ? 100 : 0
    },
    { 
      service: 'ID Card Issuance', 
      utilized: cardsIssued, 
      total: totalMembers,
      percentage: totalMembers > 0 ? Math.round((cardsIssued / totalMembers) * 100) : 0
    },
    { 
      service: 'Benefit Claims', 
      utilized: benefitsDistributed, 
      total: totalMembers,
      percentage: totalMembers > 0 ? Math.round((benefitsDistributed / totalMembers) * 100) : 0
    },
    { 
      service: 'Complaint System', 
      utilized: complaintsReceived, 
      total: totalMembers,
      percentage: totalMembers > 0 ? Math.round((complaintsReceived / totalMembers) * 100) : 0
    },
  ];

  const chartData = {
    labels: serviceData.map(item => item.service),
    datasets: [
      {
        data: serviceData.map(item => item.percentage),
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',  // Registration - Always good
          cardsIssued > 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)',  // ID Cards
          benefitsDistributed > 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)',  // Benefits
          complaintsReceived > 0 ? 'rgba(255, 99, 132, 0.8)' : 'rgba(54, 162, 235, 0.8)',  // Complaints
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          cardsIssued > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          benefitsDistributed > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          complaintsReceived > 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)',
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
          color: 'white',
          font: {
            color: 'white'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, index) => {
                const dataset = data.datasets[0];
                const value = dataset.data[index];
                const service = serviceData[index];
                return {
                  text: `${label}: ${service.utilized}/${service.total} (${value}%)`,
                  fillStyle: dataset.backgroundColor[index],
                  strokeStyle: dataset.borderColor[index],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: index
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
            const service = serviceData[context.dataIndex];
            const percentage = service.percentage;
            const utilized = service.utilized;
            const total = service.total;
            return `${context.label}: ${utilized}/${total} (${percentage}%)`;
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