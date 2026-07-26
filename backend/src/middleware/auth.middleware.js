import jwt from 'jsonwebtoken'

/**
 * Authentication Middleware
 * Protects private routes by verifying JWT in Authorization header or Cookies
 */
export const protect = (req, res, next) => {
  try {
    let token = null

    // 1. Check Authorization Bearer header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    // 2. Check signed cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    // If no token provided
    if (!token) {
      // Provide fallback mock user ID for local demo testing if requested
      if (process.env.NODE_ENV === 'development' && req.headers['x-demo-user']) {
        req.user = { _id: '65a1234567890abcdef12345', email: 'demo@lawassist.in', role: 'citizen' }
        return next()
      }

      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.',
      })
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'lawassist_ai_super_secret_jwt_key_2026_change_in_production'
    )

    req.user = {
      _id: decoded.id || decoded._id || '65a1234567890abcdef12345',
      email: decoded.email,
      role: decoded.role || 'citizen',
    }

    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    })
  }
}
