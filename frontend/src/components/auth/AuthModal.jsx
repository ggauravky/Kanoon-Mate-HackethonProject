import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Sparkles, MapPin, Phone, Briefcase } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AuthModal({ isOpen, onClose, initialMode = 'login', redirectPath }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const { login, register, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Common Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Delhi')
  const [state, setState] = useState('Delhi')
  const [pincode, setPincode] = useState('110001')
  const [preferredLanguage, setPreferredLanguage] = useState('English')

  // Advocate Specific Form State
  const [barCouncilNumber, setBarCouncilNumber] = useState('')
  const [experience, setExperience] = useState('5')
  const [practiceAreas, setPracticeAreas] = useState('Property Lawyer, Civil Lawyer')
  const [consultationFee, setConsultationFee] = useState('1200')
  const [officeAddress, setOfficeAddress] = useState('')

  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleDemoFill = () => {
    setEmail('gaurav@gmail.com')
    setPassword('DemoPass@123')
    setFullName('Gaurav Kumar Yadav')
    setCity('Delhi')
    setState('Delhi')
    setPhone('+91 9876543210')
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
      let loggedInUser = null
      if (mode === 'login') {
        loggedInUser = await login(email, password)
      } else {
        loggedInUser = await register({
          fullName,
          email,
          password,
          role,
          phone,
          city,
          state,
          pincode,
          preferredLanguage,
          barCouncilNumber,
          experience,
          practiceAreas,
          consultationFee,
          officeAddress,
        })
      }
      onClose()

      const targetRole = loggedInUser?.role || role
      const defaultPath = targetRole === 'advocate' ? '/advocate' : targetRole === 'admin' ? '/admin' : '/dashboard'
      const destination = redirectPath || location.state?.from || defaultPath
      navigate(destination)
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
          className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-100"
        >
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white relative sticky top-0 z-20">
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
                Kanoon-Mate Portal
              </span>
            </div>

            <h2 className="text-xl font-bold">
              {mode === 'login' ? 'Welcome Back to Kanoon-Mate' : 'Create Your Free Account'}
            </h2>
            <p className="text-xs text-blue-100/90 mt-1">
              {mode === 'login'
                ? 'Access your legal documents, AI chat, & advocate recommendations'
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
                    placeholder="e.g. Gaurav Kumar Yadav"
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
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'citizen', label: 'Citizen / Client' },
                      { id: 'advocate', label: 'Verified Advocate' },
                    ].map((r) => (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                          role === r.id
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location & City Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Delhi"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Advocate Specific Inputs */}
                {role === 'advocate' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-2 border-t border-slate-100">
                    <p className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                      <Briefcase size={14} /> Advocate Verification Details
                    </p>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bar Council Registration No.</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. D/1234/2015"
                        value={barCouncilNumber}
                        onChange={(e) => setBarCouncilNumber(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 px-3 text-xs text-slate-800 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Experience (Years)</label>
                        <input
                          type="number"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 px-3 text-xs text-slate-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fee (₹ / Consult)</label>
                        <input
                          type="number"
                          value={consultationFee}
                          onChange={(e) => setConsultationFee(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 px-3 text-xs text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Practice Areas (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Property Lawyer, Civil Lawyer, Criminal Lawyer"
                        value={practiceAreas}
                        onChange={(e) => setPracticeAreas(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 px-3 text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </>
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
