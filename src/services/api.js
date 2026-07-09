import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ==================== BUSES ====================
export const busAPI = {
  getAll: () => api.get('/buses'),
  getById: (id) => api.get(`/buses/${id}`),
  create: (data) => api.post('/buses', data),
  update: (id, data) => api.put(`/buses/${id}`, data),
  delete: (id) => api.delete(`/buses/${id}`),
};

// ==================== ROUTES ====================
export const routeAPI = {
  getAll: () => api.get('/routes'),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`),
};

// ==================== SCHEDULES ====================
export const scheduleAPI = {
  getAll: () => api.get('/schedules'),
  getById: (id) => api.get(`/schedules/${id}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

// ==================== SEARCH ====================
export const searchAPI = {
  searchBuses: (params) => api.get('/search/buses', { params }),
  getPopularRoutes: () => api.get('/search/popular-routes'),
};

// ==================== BOOKINGS ====================
export const bookingAPI = {
  getMyBookings: () => api.get('/bookings/my'),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getAll: () => api.get('/bookings/all'),
  getBookedSeats: (scheduleId) => api.get(`/bookings/schedule/${scheduleId}`),
};

// ==================== REVIEWS ====================
export const reviewAPI = {
  getBusReviews: (busId) => api.get(`/reviews/bus/${busId}`),
  create: (data) => api.post('/reviews', data),
};

export default api;
