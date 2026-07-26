import axios from 'axios'

// ─── Axios Instance ───────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach token if stored in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kanoon_mate_token') || localStorage.getItem('lawassist_token')
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
      'Something went wrong. Please try again.'
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

export const reportsAPI = {
  generateReport: (documentId) => API.post(`/reports/${documentId}/generate`),
  getReports: (params) => API.get('/reports', { params }),
  getReportById: (id) => API.get(`/reports/${id}`),
  deleteReport: (id) => API.delete(`/reports/${id}`),
}

export default API
