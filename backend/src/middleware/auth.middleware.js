import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

/**
 * Authentication Middleware
 * Verifies JWT token and fetches authentic user from MongoDB
 */
export const protect = async (req, res, next) => {
  try {
    let token = null

    // 1. Extract Bearer token from Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    // 2. Extract token from signed Cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    if (!token || token === 'none') {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access this resource.',
      })
    }

    // 3. Verify JWT signature
    const secret = process.env.JWT_SECRET || 'kanoon_mate_super_secret_jwt_key_2026_change_in_production'
    const decoded = jwt.verify(token, secret)

    // 4. Fetch user from MongoDB (single source of truth)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account associated with this token no longer exists.',
      })
    }

    // Attach authentic user instance to Request
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
    })
  }
}

/**
 * Authorization Middleware (RBAC)
 * Restricts route access to specified user roles (e.g. 'advocate', 'admin', 'citizen')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role (${req.user?.role || 'guest'}) is not authorized to access this resource.`,
      })
    }
    next()
  }
}
