import { createContext, useContext, useState, useCallback } from 'react'
import { mockUser } from '../data/mockData'

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ─── Helper: persist to localStorage ─────────────────────────────────────────
const STORAGE_KEY = 'lawassist_user'

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  // For Phase 5: auto-seed mock user so dashboard is immediately accessible
  const [user, setUser] = useState(() => {
    const stored = loadStoredUser()
    if (!stored) {
      // Seed mock user on first load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
      return mockUser
    }
    return stored
  })

  const login = useCallback((userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export default AuthContext
