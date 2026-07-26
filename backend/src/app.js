import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { ApiResponse } from './utils/apiResponse.js'
import authRoutes from './routes/auth.routes.js'
import documentRoutes from './routes/document.routes.js'
import ocrRoutes from './routes/ocr.routes.js'
import analysisRoutes from './routes/analysis.routes.js'
import reminderRoutes from './routes/reminder.routes.js'
import reportRoutes from './routes/report.routes.js'
import legalServiceRoutes from './routes/legalService.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import adminRoutes from './routes/admin.routes.js'
import advocateRoutes from './routes/advocate.routes.js'
import advocateDashboardRoutes from './routes/advocateDashboard.routes.js'

const app = express()

// CORS Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (
        process.env.CLIENT_URL === '*' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true)
      }
      return callback(null, true)
    },
    credentials: true,
  })
)

// Body & Cookie Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET || 'kanoon_mate_cookie_secret_2026'))

// Static Uploads Folder Serving
app.use('/uploads', express.static(path.resolve('uploads')))

// Health check route
app.get('/api/v1/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Kanoon-Mate API is operational',
    data: { status: 'UP' },
  })
})

// System Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/documents', documentRoutes)
app.use('/api/v1/documents', ocrRoutes)
app.use('/api/v1/documents', analysisRoutes)
app.use('/api/v1/reminders', reminderRoutes)
app.use('/api/v1/reports', reportRoutes)
app.use('/api/v1/legal-services', legalServiceRoutes)
app.use('/api/v1/notifications', notificationRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/advocates', advocateRoutes)
app.use('/api/v1/advocate', advocateDashboardRoutes)

// Global 404 Handler
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  })
})

export default app
