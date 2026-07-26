import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authAPI } from '../services/api'
import { mockUser } from '../data/mockData'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)
const USER_KEY = 'kanoon_mate_user'
const TOKEN_KEY = 'kanoon_mate_token'

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser)
  const [loading, setLoading] = useState(false)

  // Verify currently logged in user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && !user) {
      authAPI
        .getMe()
        .then((res) => {
          if (res.data?.data?.user) {
            const fetchedUser = res.data.data.user
            setUser(fetchedUser)
            localStorage.setItem(USER_KEY, JSON.stringify(fetchedUser))
          }
        })
        .catch(() => {
          // Fallback to mock session if backend is unavailable or token expired
        })
    }
  }, [])

  // Login handler
  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      // Try backend authentication
      const response = await authAPI.login({ email, password })
      const { user: userData, token } = response.data?.data || {}

      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      }
      const finalUser = userData || {
        name: email.split('@')[0],
        email,
        role: 'citizen',
      }

      localStorage.setItem(USER_KEY, JSON.stringify(finalUser))
      setUser(finalUser)
      toast.success(`Welcome back, ${finalUser.name || 'User'}!`)
      return finalUser
    } catch (err) {
      // If backend fails/offline, handle fallback gracefully for UI demo
      console.warn('Backend login fallback active:', err.message)
      const fallbackUser = {
        id: 'usr_demo',
        name: email ? email.split('@')[0].toUpperCase() : 'Gaurav Sharma',
        email: email || 'gaurav.sharma@example.com',
        role: 'citizen',
        plan: 'Pro',
      }
      localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser))
      setUser(fallbackUser)
      toast.success('Logged in (Demo Mode)!')
      return fallbackUser
    } finally {
      setLoading(false)
    }
  }, [])

  // Register handler
  const register = useCallback(async (userData) => {
    setLoading(true)
    try {
      const response = await authAPI.register(userData)
      const { user: newUser, token } = response.data?.data || {}

      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      }
      const finalUser = newUser || {
        name: userData.fullName || userData.name,
        email: userData.email,
        role: userData.role || 'citizen',
      }

      localStorage.setItem(USER_KEY, JSON.stringify(finalUser))
      setUser(finalUser)
      toast.success('Account created successfully!')
      return finalUser
    } catch (err) {
      console.warn('Backend register fallback active:', err.message)
      const fallbackUser = {
        id: 'usr_new',
        name: userData.fullName || userData.name || 'New Citizen User',
        email: userData.email,
        role: userData.role || 'citizen',
        plan: 'Standard',
      }
      localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser))
      setUser(fallbackUser)
      toast.success('Account created (Demo Mode)!')
      return fallbackUser
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch {
      // silent catch for offline
    }
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    toast.success('Logged out successfully.')
  }, [])

  // Update User state locally
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export default AuthContext
