// src/services/reportsService.js
import { api } from './api';

export const reportsService = {
  // Get all reports
  getAllReports: () => api.get('/reports'),
  
  // Get report by ID
  getReport: (id) => api.get(`/reports/${id}`),
  
  // Generate a specific type of report
  generateReport: (type, params = {}) => api.post(`/reports/generate/${type}`, params),
  
  // Get PWD statistics for barangay presidents
  getBarangayStats: (barangay) => api.get(`/reports/barangay-stats/${encodeURIComponent(barangay)}`),
  
  // Get PWD masterlist for barangay
  getPWDMasterlist: (barangay) => api.get(`/reports/pwd-masterlist/${encodeURIComponent(barangay)}`),
  
  // Get application status report
  getApplicationStatusReport: (barangay) => api.get(`/reports/application-status/${encodeURIComponent(barangay)}`),
  
  // Get disability distribution report
  getDisabilityDistribution: (barangay) => api.get(`/reports/disability-distribution/${encodeURIComponent(barangay)}`),
  
  // Get age group analysis
  getAgeGroupAnalysis: (barangay) => api.get(`/reports/age-group-analysis/${encodeURIComponent(barangay)}`),
  
  // Get benefit distribution report
  getBenefitDistribution: (barangay) => api.get(`/reports/benefit-distribution/${encodeURIComponent(barangay)}`),
  
  // Get monthly activity summary
  getMonthlyActivitySummary: (barangay) => api.get(`/reports/monthly-activity/${encodeURIComponent(barangay)}`),
  
  // Get city-wide statistics for admin
  getCityWideStats: () => api.get('/reports/city-wide-stats'),
  
  // Get barangay performance report
  getBarangayPerformance: () => api.get('/reports/barangay-performance'),
  
  // Download report as PDF/Excel
  downloadReport: (reportId, format = 'pdf') => api.get(`/reports/${reportId}/download?format=${format}`, { 
    responseType: 'blob' 
  }),
  
  // Create new report
  createReport: (reportData) => api.post('/reports', reportData),
  
  // Update report
  updateReport: (id, reportData) => api.put(`/reports/${id}`, reportData),
  
  // Delete report
  deleteReport: (id) => api.delete(`/reports/${id}`)
};

export default reportsService;
