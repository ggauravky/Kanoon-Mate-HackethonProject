import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Custom Hook: useProtectedAction
 * Encapsulates authentication checks for interactive CTA buttons and protected actions.
 * If user is authenticated, executes action or navigates to target path directly.
 * If user is unauthenticated, opens AuthModal or redirects to login with post-login target.
 */
export function useProtectedAction() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [targetPath, setTargetPath] = useState('/dashboard')

  const executeProtectedAction = useCallback(
    (path = '/dashboard', callback) => {
      // Prevent button clicks while authentication status is still loading
      if (loading) return

      if (isAuthenticated) {
        if (typeof callback === 'function') {
          callback()
        } else if (path) {
          navigate(path)
        }
      } else {
        setTargetPath(path)
        setAuthModalOpen(true)
      }
    },
    [isAuthenticated, loading, navigate]
  )

  return {
    executeProtectedAction,
    isAuthenticated,
    loading,
    authModalOpen,
    setAuthModalOpen,
    targetPath,
  }
}

export default useProtectedAction
