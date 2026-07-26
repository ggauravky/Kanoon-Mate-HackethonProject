import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authAPI } from '../services/api'
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
    if (token) {
      authAPI
        .getMe()
        .then((res) => {
          if (res.data?.data?.user) {
            const fetchedUser = res.data.data.user
            fetchedUser.name = fetchedUser.fullName || fetchedUser.name
            setUser(fetchedUser)
            localStorage.setItem(USER_KEY, JSON.stringify(fetchedUser))
          }
        })
        .catch(() => {
          // If token expired or invalid on server, purge local state
          localStorage.removeItem(USER_KEY)
          localStorage.removeItem(TOKEN_KEY)
          setUser(null)
        })
    }
  }, [])

  // Login handler
  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      const { user: userData, token } = response.data?.data || {}

      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      }

      const finalUser = userData || {}
      finalUser.name = finalUser.fullName || finalUser.name || email.split('@')[0]

      localStorage.setItem(USER_KEY, JSON.stringify(finalUser))
      setUser(finalUser)
      toast.success(`Welcome back, ${finalUser.name}!`)
      return finalUser
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please check your credentials.'
      toast.error(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  // Register handler
  const register = useCallback(async (userData) => {
    setLoading(true)
    try {
      const response = await authAPI.register({
        fullName: userData.fullName || userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'citizen',
      })

      const { user: newUser, token } = response.data?.data || {}

      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      }

      const finalUser = newUser || {}
      finalUser.name = finalUser.fullName || finalUser.name || userData.email.split('@')[0]

      localStorage.setItem(USER_KEY, JSON.stringify(finalUser))
      setUser(finalUser)
      toast.success('Account created successfully!')
      return finalUser
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please check your details.'
      toast.error(errorMsg)
      throw new Error(errorMsg)
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
