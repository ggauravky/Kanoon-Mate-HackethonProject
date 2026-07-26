import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Bot,
  AlertTriangle,
  Calendar,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Users,
  ChevronDown,
  Lock,
  Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { APP_NAME, APP_TAGLINE } from '../constants/app'
import LegalTranslatorWidget from '../components/widgets/LegalTranslatorWidget'
import CitizenRightsWidget from '../components/widgets/CitizenRightsWidget'
import AuthModal from '../components/auth/AuthModal'
import { useProtectedAction } from '../hooks/useProtectedAction'

const FAQ_DATA = [
  {
    q: 'What is Kanoon-Mate and how does it help Indian citizens?',
    a: 'Kanoon-Mate is an artificial intelligence platform designed specifically for Indian legal context. It translates complex legal jargon in rental agreements, consumer notices, and employment contracts into plain English and Hindi, while answering legal queries with reference to BNSS, IPC, and Indian statutory acts.',
  },
  {
    q: 'Can I upload my own PDF or scan of a legal document?',
    a: 'Yes! You can upload rental contracts, legal notices, sale deeds, or FIR copies in PDF or image format. Kanoon-Mate scans the text, detects hidden risks, lock-in clauses, or unfair penalty terms, and generates a simple 1-page summary.',
  },
  {
    q: 'Is Kanoon-Mate a replacement for a lawyer or advocate?',
    a: 'No. Kanoon-Mate is an educational and document simplification assistant. It helps you understand legal terms, prepare for meetings with advocates, and know your statutory rights. For court representation or formal legal opinions, we always recommend consulting a qualified advocate.',
  },
  {
    q: 'Is my uploaded legal document confidential and private?',
    a: 'Absolutely. All documents are processed with 256-bit encryption in strict compliance with the Indian Digital Personal Data Protection (DPDP) Act. We never share or sell user documents.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { executeProtectedAction, authModalOpen, setAuthModalOpen, targetPath, loading } = useProtectedAction()
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  return (
    <div className="space-y-24 pb-20">
      {/* ── 1. Hero Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-600/20 blur-[110px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-1.5 text-xs font-semibold text-blue-300 shadow-xl backdrop-blur-md"
          >
            <Sparkles size={14} className="text-blue-400 animate-pulse" />
            <span>AI Legal Intelligence for 1.4 Billion Indian Citizens</span>
            <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] text-white font-bold">BNSS / IPC Ready</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.15]"
          >
            Understand Indian Legal Documents <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              & Know Your Rights in Plain Words
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed"
          >
            {APP_TAGLINE}. Upload rental agreements, consumer notices, or contract drafts. Get instant summaries, risk alerts, and BNSS query answers in English or Hindi.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => executeProtectedAction('/dashboard/upload')}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold px-8 py-4 text-base shadow-2xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <FileText size={18} />
              <span>Upload Document to Simplify</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => executeProtectedAction('/dashboard/chat')}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white font-semibold px-6 py-4 text-base backdrop-blur-md transition-all hover:border-slate-600 disabled:opacity-50"
            >
              <Bot size={18} className="text-indigo-400" />
              <span>Ask AI Assistant</span>
            </button>
          </motion.div>

          {/* Feature Highlights Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto"
          >
            {[
              { icon: ShieldCheck, title: 'DPDP Compliant', desc: 'Bank-grade privacy' },
              { icon: Zap, title: 'Instant OCR & AI', desc: '30 sec turnaround' },
              { icon: BookOpen, title: 'Hindi & English', desc: 'Multilingual legal support' },
              { icon: Lock, title: '100% Confidential', desc: 'Encrypted storage' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <item.icon size={20} className="text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2. Interactive Jargon Translator Section ──────────────────────── */}
      <section id="translator" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LegalTranslatorWidget />
      </section>

      {/* ── 3. Core Features Grid ──────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Everything You Need</span>
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Designed for Citizens, Tenants, Consumers & Professionals
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Never sign an unfair contract or miss a legal deadline again.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              title: 'Legal Document Simplifier',
              desc: 'Converts multi-page rent agreements, employment contracts, and sale deeds into 1-page summaries with plain terms.',
              color: 'from-blue-500 to-indigo-500',
            },
            {
              icon: Bot,
              title: 'AI Indian Law Assistant',
              desc: 'Answers questions on Consumer Protection Act, Rent Control, BNSS/IPC sections, and workplace rights in real-time.',
              color: 'from-indigo-500 to-violet-500',
            },
            {
              icon: AlertTriangle,
              title: 'Hidden Risk & Penalty Detector',
              desc: 'Flag unfair lock-in clauses, heavy forfeiture penalties, and hidden liability terms before you sign.',
              color: 'from-amber-500 to-red-500',
            },
            {
              icon: Calendar,
              title: 'Court & Reply Deadline Tracker',
              desc: 'Track statutory reply windows for legal notices, rent renewal dates, and consumer commission filing deadlines.',
              color: 'from-emerald-500 to-teal-500',
            },
            {
              icon: BookOpen,
              title: 'Citizen Statutory Rights Guide',
              desc: 'Step-by-step guides for zero FIR filing, cyber fraud reporting on 1930, POSH complaints, and consumer refunds.',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: Lock,
              title: 'Secure Confidential Document Vault',
              desc: 'Organize and categorize all your personal legal notices, receipts, and agreements safely in one place.',
              color: 'from-slate-500 to-slate-700',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">{feature.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. Indian Citizen Rights Section ──────────────────────────────── */}
      <section id="rights" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Statutory Knowledge</span>
          <h2 className="text-3xl font-black text-white">Know Your Legal Rights Under Indian Law</h2>
          <p className="text-xs text-slate-400">Click any category below to expand details</p>
        </div>
        <CitizenRightsWidget />
      </section>

      {/* ── 5. How It Works Workflow ───────────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">3-Step Simple Process</span>
          <h2 className="text-3xl font-black text-white">How Kanoon-Mate Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: '01',
              title: 'Upload or Paste Legal Text',
              desc: 'Upload any legal PDF, agreement scan, or type your query in simple Hindi or English.',
            },
            {
              step: '02',
              title: 'AI Analysis & Risk Audit',
              desc: 'Kanoon-Mate scans clauses against Indian laws, identifies risk factors, and extracts key obligations.',
            },
            {
              step: '03',
              title: 'Get Plain Actionable Insights',
              desc: 'Receive a clean 1-page summary, response steps, or ask follow-up questions to the AI assistant.',
            },
          ].map((item, idx) => (
            <div key={idx} className="relative rounded-3xl border border-slate-800 bg-slate-900/50 p-8 space-y-3 text-center">
              <span className="text-4xl font-black text-indigo-500/30">{item.step}</span>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. FAQ Accordion ──────────────────────────────────────────────── */}
      <section id="faqs" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Got Questions?</span>
          <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={index}
                onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </div>
                {isOpen && <p className="mt-3 text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800">{faq.a}</p>}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 7. Call To Action Footer Banner ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black">
              Ready to Take Control of Your Legal Rights?
            </h2>
            <p className="text-sm text-blue-100">
              Join thousands of Indian citizens using Kanoon-Mate to simplify agreements and get instant legal clarity.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-blue-950 font-bold px-8 py-4 text-sm shadow-xl hover:bg-blue-50 transition-all hover:scale-105"
            >
              <span>Get Started for Free</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
        redirectPath={targetPath}
      />
    </div>
  )
}
