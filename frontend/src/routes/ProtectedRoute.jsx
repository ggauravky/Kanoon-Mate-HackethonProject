import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute
 * Wraps dashboard routes. Redirects to '/' if user is not authenticated.
 * In Phase 5, the mock AuthContext always provides a user, so this
 * effectively always passes. It's structured to be real-auth-ready.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
