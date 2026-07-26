import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 LawAssist AI Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database', err);
});
