import api from './api';

export const applicationService = {
  // Get all applications
  getAll: async () => {
    try {
      const response = await api.get('/applications');
      return response;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Create new application
  create: async (applicationData) => {
    try {
      const response = await api.post('/applications', applicationData);
      return response;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Update application
  update: async (id, applicationData) => {
    try {
      const response = await api.put(`/applications/${id}`, applicationData);
      return response;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },

  // Delete application
  delete: async (id) => {
    try {
      const response = await api.delete(`/applications/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  // Get application by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  // Update application status
  updateStatus: async (id, statusData) => {
    try {
      const response = await api.patch(`/applications/${id}/status`, statusData);
      return response;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Get applications by status
  getByStatus: async (status) => {
    try {
      const response = await api.get(`/applications/status/${encodeURIComponent(status)}`);
      return response;
    } catch (error) {
      console.error('Error fetching applications by status:', error);
      throw error;
    }
  }
};

export default applicationService;
