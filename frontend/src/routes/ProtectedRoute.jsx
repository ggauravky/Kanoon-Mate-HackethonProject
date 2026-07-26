import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

/**
 * ProtectedRoute
 * Wraps protected routes. Redirects to '/' with target location state if not authenticated.
 * If `adminOnly` is true, also checks that the user role is admin or super_admin.
 */
export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />
  }

  if (adminOnly && !(user?.role === 'admin' || user?.role === 'super_admin')) {
    toast.error('Access denied. Administrator privileges required.')
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
