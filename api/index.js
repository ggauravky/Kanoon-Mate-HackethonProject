import app from '../backend/src/app.js'
import { connectDB } from '../backend/src/config/db.js'

export default async function handler(req, res) {
  try {
    await connectDB()
    return app(req, res)
  } catch (err) {
    console.error('Vercel API Handler Error:', err)
    return res.status(500).json({
      success: false,
      message: 'Serverless API Execution Failure',
      error: err.message,
    })
  }
}
