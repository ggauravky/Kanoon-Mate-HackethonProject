import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Scale, LogIn, UserPlus, ShieldCheck, HeartHandshake, FileText, Bot, Sparkles, ChevronRight } from 'lucide-react'
import { APP_NAME } from '../../constants/app'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../auth/AuthModal'

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const openLogin = () => {
    setAuthMode('login')
    setAuthModalOpen(true)
  }

  const openRegister = () => {
    setAuthMode('register')
    setAuthModalOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Scale className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white">{APP_NAME}</span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                  AI for Indian Law
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Simplifying Justice for Every Indian Citizen</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#translator" className="hover:text-blue-400 transition-colors">Jargon Translator</a>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#rights" className="hover:text-blue-400 transition-colors">Citizen Rights</a>
            <a href="#faqs" className="hover:text-blue-400 transition-colors">FAQs</a>
          </nav>

          {/* User / Auth CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  <Bot size={15} />
                  <span>Go to Dashboard</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-3 py-2 text-xs font-medium transition-all"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 px-3.5 py-2 text-xs font-semibold transition-all hover:border-slate-600"
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={openRegister}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-4 py-2 text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                >
                  <UserPlus size={14} />
                  <span>Get Started Free</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 pb-10 border-b border-slate-800/80">
            {/* Column 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <Scale className="h-6 w-6 text-blue-500" />
                <span className="text-base font-bold">{APP_NAME}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering Indian citizens with AI-driven legal document simplification, instant BNSS/IPC query responses, and tenant & consumer rights protection.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
                <ShieldCheck size={14} />
                <span>DPDP Act Compliant • 256-bit Encrypted</span>
              </div>
            </div>

            {/* Column 2: Legal Tools */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">AI Legal Tools</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Rent Agreement Analyzer</a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Consumer Forum Helper</a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors">FIR & BNSS Query Assistant</a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Cheque Bounce Notice Explainer</a></li>
              </ul>
            </div>

            {/* Column 3: Citizen Rights */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Indian Citizen Rights</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#rights" className="hover:text-blue-400 transition-colors">Tenant Rights under Rent Act</a></li>
                <li><a href="#rights" className="hover:text-blue-400 transition-colors">POSH Workplace Rights</a></li>
                <li><a href="#rights" className="hover:text-blue-400 transition-colors">Consumer Protection Act 2019</a></li>
                <li><a href="#rights" className="hover:text-blue-400 transition-colors">Cyber Fraud Helplines (1930)</a></li>
              </ul>
            </div>

            {/* Column 4: Quick Contacts & Portals */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">National Legal Portals</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="https://e-services.ecourts.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">eCourts India Portal</a></li>
                <li><a href="https://consumerhelpline.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">National Consumer Helpline</a></li>
                <li><a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">National Cyber Crime Portal</a></li>
                <li><a href="https://nalsa.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">NALSA Legal Aid</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} {APP_NAME}. Built for Indian Citizens.</p>
            <p className="text-[11px] text-slate-500 max-w-xl text-center md:text-right">
              Disclaimer: {APP_NAME} provides AI-generated legal insights and document analysis for educational & informational purposes. It does not constitute formal legal advice from a registered advocate.
            </p>
          </div>
        </div>
      </footer>

      {/* ── Auth Modal ─────────────────────────────────────────────────────── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
}

export default AppLayout
