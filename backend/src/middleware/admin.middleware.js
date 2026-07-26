/**
 * Role-Based Authorization Middleware for Admin Access
 * Enforces admin/super_admin privileges on protected routes
 */
export const authorizeAdmin = (req, res, next) => {
  try {
    const userRole = req.user?.role?.toLowerCase()

    // Check development demo override header
    if (process.env.NODE_ENV === 'development' && req.headers['x-admin-demo']) {
      req.user = {
        ...req.user,
        role: 'admin',
      }
      return next()
    }

    // Check role authorization
    if (userRole === 'admin' || userRole === 'super_admin') {
      return next()
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrative privileges are required to perform this action.',
    })
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Authorization check failed.',
    })
  }
}
