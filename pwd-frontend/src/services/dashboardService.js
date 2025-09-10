// src/services/dashboardService.js
import { api } from './api';

const dashboardService = {
  async getStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getApplications() {
    try {
      const response = await api.get('/applications');
      return response;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  async getRecentActivities() {
    try {
      const response = await api.get('/dashboard/recent-activities');
      return response;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  async getBarangayContacts() {
    try {
      const response = await api.get('/dashboard/barangay-contacts');
      return response;
    } catch (error) {
      console.error('Error fetching barangay contacts:', error);
      throw error;
    }
  }
};

export default dashboardService;
