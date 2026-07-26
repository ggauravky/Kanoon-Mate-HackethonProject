import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

/**
 * ProtectedRoute
 * Enforces authentication and role-based access control (RBAC).
 */
export default function ProtectedRoute({ allowedRole = 'citizen', adminOnly = false }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />
  }

  // Admin Role Check
  if (adminOnly || allowedRole === 'admin') {
    if (!(user?.role === 'admin' || user?.role === 'super_admin')) {
      toast.error('Access denied. Administrator privileges required.')
      return <Navigate to={user?.role === 'advocate' ? '/advocate' : '/dashboard'} replace />
    }
    return <Outlet />
  }

  // Advocate Role Check
  if (allowedRole === 'advocate') {
    if (user?.role !== 'advocate') {
      toast.error('Access denied. Verified Advocate account required.')
      return <Navigate to="/dashboard" replace />
    }
    return <Outlet />
  }

  // Citizen Role Route Protection: Redirect Advocates & Admins to their respective consoles
  if (allowedRole === 'citizen') {
    if (user?.role === 'advocate') {
      return <Navigate to="/advocate" replace />
    }
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return <Navigate to="/admin" replace />
    }
  }

  return <Outlet />
}
