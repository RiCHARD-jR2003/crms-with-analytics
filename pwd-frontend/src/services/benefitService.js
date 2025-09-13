// src/services/benefitService.js

import { api } from './api';

const benefitService = {
  // Get all benefits
  getAll: async () => {
    try {
      const response = await api.get('/benefits-simple');
      return response;
    } catch (error) {
      console.error('Error fetching benefits:', error);
      throw error;
    }
  },

  // Get a specific benefit by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/benefits/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching benefit:', error);
      throw error;
    }
  },

  // Create a new benefit
  create: async (benefitData) => {
    try {
      const response = await api.post('/benefits-simple', benefitData);
      return response;
    } catch (error) {
      console.error('Error creating benefit:', error);
      throw error;
    }
  },

  // Update a benefit
  update: async (id, benefitData) => {
    try {
      const response = await api.put(`/benefits-simple/${id}`, benefitData);
      return response;
    } catch (error) {
      console.error('Error updating benefit:', error);
      throw error;
    }
  },

  // Delete a benefit
  delete: async (id) => {
    try {
      const response = await api.delete(`/benefits-simple/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting benefit:', error);
      throw error;
    }
  },

  // Get benefit claims for a specific benefit
  getClaims: async (id) => {
    try {
      const response = await api.get(`/benefits/${id}/claims`);
      return response;
    } catch (error) {
      console.error('Error fetching benefit claims:', error);
      throw error;
    }
  }
};

export default benefitService;
