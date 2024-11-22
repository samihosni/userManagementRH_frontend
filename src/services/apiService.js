import axios from 'axios';

// Set the base URL for the API
const BASE_URL = 'http://localhost:8080/';

const apiService = {
  // Method to perform a POST request
  post: (endpoint, data) => {
    return axios.post(`${BASE_URL}${endpoint}`, data);
  },

  // Method to perform a GET request
  get: (endpoint, params) => {
    return axios.get(`${BASE_URL}${endpoint}`, { params });
  },

  // Additional methods for PUT, DELETE, etc.
  put: (endpoint, data) => {
    return axios.put(`${BASE_URL}${endpoint}`, data);
  },
  delete: (endpoint) => {
    return axios.delete(`${BASE_URL}${endpoint}`);
  },

  postHolidayRequest: (endpoint, formData) => {
    return axios.post(`${BASE_URL}${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  putTimeSheet: (endpoint, data) => {
    const token = localStorage.getItem("token"); 
    console.log(localStorage);
    
    return axios.put(`${BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

export default apiService;