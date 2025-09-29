import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const campaignService = {
  create: (campaignData) => api.post('/campaigns', campaignData),
  getAll: () => api.get('/campaigns'),
  getById: (id) => api.get(`/campaigns/${id}`),
};

export const contactService = {
  create: (contactData) => api.post('/contacts', contactData),
  getAll: () => api.get('/contacts'),
  getGroups: () => api.get('/contacts/groups'),
};

export const whatsappService = {
  initSession: () => api.get('/whatsapp/init'),
  getStatus: () => api.get('/whatsapp/status'),
  sendTestMessage: (data) => api.post('/whatsapp/test', data),
};