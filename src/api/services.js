import api from './axios';

// ==================== AUTH API ====================
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  signin: (data) => api.post('/auth/signin', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

// ==================== CONTACTS API ====================
export const contactsAPI = {
  getAll: (params) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post('/contacts', data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
  getStats: () => api.get('/contacts/stats'),
  exportCSV: (params) =>
    api.get('/contacts/export/csv', {
      params,
      responseType: 'blob',
    }),
};

// ==================== ACTIVITY LOGS API ====================
export const activityLogsAPI = {
  getAll: (params) => api.get('/activity-logs', { params }),
};
