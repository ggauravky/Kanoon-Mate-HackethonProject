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

export default API
