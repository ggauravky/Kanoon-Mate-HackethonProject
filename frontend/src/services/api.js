import axios from 'axios'

// ─── Axios Instance ───────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach token if stored in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kanoon_mate_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — standard error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong. Please check your network connection.'
    return Promise.reject(new Error(message))
  }
)

// ─── Auth API Endpoints ───────────────────────────────────────────────────────
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
}

// ─── Document API Endpoints ───────────────────────────────────────────────────
export const documentsAPI = {
  uploadDocument: (formData, onUploadProgress) =>
    API.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    }),
  getDocuments: () => API.get('/documents'),
  getDocumentById: (id) => API.get(`/documents/${id}`),
  extractText: (id) => API.post(`/documents/${id}/extract-text`),
  analyzeDocument: (id) => API.post(`/documents/${id}/analyze`),
  getAnalysis: (id) => API.get(`/documents/${id}/analysis`),
  deleteDocument: (id) => API.delete(`/documents/${id}`),
}

// ─── OCR & AI Analysis API Endpoints ──────────────────────────────────────────
export const ocrAPI = {
  processOCR: (documentId) => API.post(`/documents/${documentId}/ocr`),
  getOCRResult: (documentId) => API.get(`/documents/${documentId}/ocr`),
}

export const analysisAPI = {
  analyzeDocument: (documentId) => API.post(`/documents/${documentId}/analyze`),
  getAnalysisResult: (documentId) => API.get(`/documents/${documentId}/analysis`),
}

// ─── Deadline & Reminder API Endpoints ────────────────────────────────────────
export const remindersAPI = {
  getReminders: (params) => API.get('/reminders', { params }),
  getReminderById: (id) => API.get(`/reminders/${id}`),
  createReminder: (reminderData) => API.post('/reminders', reminderData),
  updateReminder: (id, updateData) => API.patch(`/reminders/${id}`, updateData),
  deleteReminder: (id) => API.delete(`/reminders/${id}`),
}

// ─── AI Legal Reports API Endpoints ───────────────────────────────────────────
export const reportsAPI = {
  getReports: (params) => API.get('/reports', { params }),
  getReportById: (id) => API.get(`/reports/${id}`),
  generateReport: (documentId) => API.post(`/reports/${documentId}/generate`),
  generatePDFReport: (documentId) => API.get(`/reports/pdf/${documentId}`, { responseType: 'blob' }),
  deleteReport: (id) => API.delete(`/reports/${id}`),
}

// ─── Legal Help Services Hub Endpoints ───────────────────────────────────────
export const legalServicesAPI = {
  getServices: (params) => API.get('/legal-services', { params }),
  searchServices: (params) => API.get('/legal-services/search', { params }),
  getServiceById: (id) => API.get(`/legal-services/${id}`),
  searchAdvocates: (params) => API.get('/legal-services/advocates', { params }),
  getLegalAidCenters: (params) => API.get('/legal-services/aid-centers', { params }),
  getEdaakhilGuides: () => API.get('/legal-services/edaakhil-guides'),
}

// ─── Smart Notification API Endpoints ─────────────────────────────────────────
export const notificationsAPI = {
  getNotifications: (params) => API.get('/notifications', { params }),
  markAsRead: (id) => API.patch(`/notifications/${id}/read`),
  markAllAsRead: () => API.patch('/notifications/read-all'),
  deleteNotification: (id) => API.delete(`/notifications/${id}`),
}

// ─── Admin Dashboard API Endpoints ────────────────────────────────────────────
export const adminAPI = {
  getAnalytics: () => API.get('/admin/analytics'),
  getUsers: (params) => API.get('/admin/users', { params }),
  updateUser: (id, updateData) => API.patch(`/admin/users/${id}`, updateData),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  broadcastNotification: (data) => API.post('/admin/notifications/broadcast', data),
}

// ─── Advocate Directory & AI Recommendation Endpoints ─────────────────────────
export const advocatesAPI = {
  getAdvocates: (params) => API.get('/advocates', { params }),
  getAdvocateById: (id) => API.get(`/advocates/${id}`),
  getRecommended: (documentId) => API.get(`/advocates/recommended/${documentId}`),
  toggleFavorite: (id) => API.post(`/advocates/${id}/favorite`),
  getFavorites: () => API.get('/advocates/favorites'),
}

// ─── Advocate Dedicated Dashboard Endpoints ─────────────────────────────────
export const advocateAPI = {
  getDashboard: () => API.get('/advocate/dashboard'),
  getProfile: () => API.get('/advocate/profile'),
  updateProfile: (profileData) => API.put('/advocate/profile', profileData),
  getClientRequests: (params) => API.get('/advocate/client-requests', { params }),
  updateRequestStatus: (id, status) => API.patch(`/advocate/client-requests/${id}`, { status }),
  getAnalytics: () => API.get('/advocate/analytics'),
}

export default API
