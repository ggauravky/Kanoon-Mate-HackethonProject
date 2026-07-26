import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiResponse } from './utils/apiResponse.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Health check route
app.get('/api/v1/health', (req, res) => {
  return ApiResponse.success(res, 'LawAssist AI API is operational', { status: 'UP' });
});

// Global 404 Handler
app.use((req, res, next) => {
  return ApiResponse.error(res, `Route ${req.originalUrl} not found`, [], 404);
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return ApiResponse.error(res, message, err.errors || [], statusCode);
});

export default app;
