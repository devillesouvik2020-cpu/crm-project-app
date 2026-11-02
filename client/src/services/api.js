import axios from 'axios';

// Use environment variable (VITE_API_URL = backend base URL, e.g. http://localhost:5000)
// Appends /api so all route paths stay clean (e.g. /auth/login, /projects)
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000 // 30s timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Render.com Cold-Start Resilience: Retry up to 3 times on 502/503/504 or Network Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Check if error is due to cold start (502, 503, 504, or network timeout)
    const isColdStartError = 
      !error.response || 
      [502, 503, 504].includes(error.response?.status) || 
      error.code === 'ECONNABORTED';

    if (isColdStartError && config && !config._retryCount) {
      config._retryCount = 0;
    }

    if (isColdStartError && config && config._retryCount < 3) {
      config._retryCount += 1;
      const delay = config._retryCount * 1500; // 1.5s, 3s, 4.5s
      console.warn(`[API Warmup] Backend may be waking up (Cold-start). Retrying attempt ${config._retryCount}/3 in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Health & Keep-Alive
export const systemAPI = {
  getHealth: () => api.get('/health'),
};

// Projects
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getUpdates: (id) => api.get(`/projects/${id}/updates`),
  addDPR: (id, data) => api.post(`/projects/${id}/dpr`, data),
  addTransaction: (id, data) => api.post(`/projects/${id}/transaction`, data),
  addProgress: (id, data) => api.post(`/projects/${id}/progress`, data),
  addTask: (id, data) => api.post(`/projects/${id}/task`, data),
  addMeeting: (id, data) => api.post(`/projects/${id}/meeting`, data),
};

// CRM
export const crmAPI = {
  getLeads: () => api.get('/crm/leads'),
  createLead: (data) => api.post('/crm/leads', data),
  updateLead: (id, data) => api.put(`/crm/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/crm/leads/${id}`),
  getQuotations: () => api.get('/crm/quotations'),
  createQuotation: (data) => api.post('/crm/quotations', data),
  updateQuotation: (id, data) => api.put(`/crm/quotations/${id}`, data),
  deleteQuotation: (id) => api.delete(`/crm/quotations/${id}`),
  seedSamples: () => api.post('/crm/seed-samples'),
};

// Invites
export const inviteAPI = {
  getAll: () => api.get('/invites'),
  create: (data) => api.post('/invites', data),
  delete: (id) => api.delete(`/invites/${id}`),
};

// Resources
export const resourceAPI = {
  getAll: () => api.get('/resources'),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
};

export default api;
