import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const { login, register, loading } = useAuth()
  const navigate = useNavigate()

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleDemoFill = () => {
    setEmail('citizen.demo@lawassist.in')
    setPassword('DemoPass@123')
    setFullName('Rajesh Kumar')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (mode === 'register' && !fullName) {
      setError('Please provide your full name.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register({ fullName, email, password, role })
      }
      onClose()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your inputs.')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/65 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100"
        >
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm text-blue-300">
                <ShieldCheck size={20} />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
                LawAssist AI Portal
              </span>
            </div>

            <h2 className="text-xl font-bold">
              {mode === 'login' ? 'Welcome Back to LawAssist AI' : 'Create Your Free Account'}
            </h2>
            <p className="text-xs text-blue-100/90 mt-1">
              {mode === 'login'
                ? 'Access your legal documents, AI chat, & deadline tracker'
                : 'Empowering Indian citizens with simple legal clarity'}
            </p>

            {/* Mode Switch Pills */}
            <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-black/20 p-1 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white text-blue-950 font-semibold shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register')
                  setError('')
                }}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white text-blue-950 font-semibold shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Full Name (Register Only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User size={17} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Role Selection (Register Only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'citizen', label: 'Citizen' },
                    { id: 'law_student', label: 'Law Student' },
                    { id: 'advocate', label: 'Advocate' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                        role === r.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Demo Credential Autofill Helper */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleDemoFill}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <Sparkles size={13} /> Fill Demo Credentials
              </button>
              <span className="text-[11px] text-slate-400">256-bit Encrypted</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 text-sm font-semibold shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Log In to Account' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-slate-500">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>Compliant with Indian Data Privacy & DPDP Act guidelines</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
