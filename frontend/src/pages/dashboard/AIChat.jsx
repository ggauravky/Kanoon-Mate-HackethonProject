import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, Scale, BookOpen, Copy, Check, ShieldCheck, Settings2, Users, ArrowRight } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import VoiceButton from '../../components/voice/VoiceButton'
import VoicePlayer from '../../components/voice/VoicePlayer'
import VoiceRecorder from '../../components/voice/VoiceRecorder'
import VoiceSettings, { getStoredVoiceSettings } from '../../components/voice/VoiceSettings'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'

const KNOWLEDGE_RESPONSES = {
  tenant: {
    title: 'Tenant Rights under Model Tenancy Act & State Rent Laws',
    category: 'Property Lawyer',
    text: 'Under Indian Tenant & Rent Control Laws:\n1. Notice Period: A landlord must issue at least 30 days written notice before eviction.\n2. Security Deposit Refund: Deposit must be refunded within 30 days of vacating.\n3. Essential Utilities: Under State Rent Control Acts, a landlord cannot cut off water or electricity supplies.\n4. Rent Increase: Rent cannot be increased arbitrarily during an active lease period unless specified in the registered agreement.',
    citation: 'Model Tenancy Act 2021 & Delhi/State Rent Control Acts',
  },
  cheque: {
    title: 'Section 138 of Negotiable Instruments (NI) Act 1881',
    category: 'Criminal Lawyer',
    text: 'If a cheque bounces due to insufficient funds:\n1. Statutory Notice: The payee must send a legal notice within 30 days of cheque return memo.\n2. Payment Window: The drawer gets 15 days to pay the amount upon receipt of notice.\n3. Criminal Complaint: If unpaid after 15 days, a court complaint can be filed under Section 138.\n4. Penalty: Punishable by up to 2 years imprisonment or fine up to double the cheque amount.',
    citation: 'Section 138 NI Act 1881',
  },
  consumer: {
    title: 'Filing Consumer Complaint under Consumer Protection Act 2019',
    category: 'Consumer Lawyer',
    text: 'To file a complaint for defective product or deficient service:\n1. Online Portal: File directly at consumerhelpline.gov.in (NCH) or e-Daakhil portal.\n2. Jurisdiction: Up to ₹50 Lakhs → District Commission. ₹50L to ₹2 Crores → State Commission.\n3. Compensation: You can claim refund + interest + compensation for mental agony.',
    citation: 'Consumer Protection Act 2019',
  },
  fir: {
    title: 'Zero FIR & Police Procedure under BNSS 2023 / CrPC',
    category: 'Criminal Lawyer',
    text: 'Rights regarding police complaints:\n1. Zero FIR: Any police station must record your FIR regardless of jurisdiction location.\n2. Arrest of Women: Women cannot be arrested between sunset (6 PM) and sunrise (6 AM) except in exceptional circumstances with magistrate approval.\n3. Legal Counsel: You have the right to consult an advocate during interrogation.',
    citation: 'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
  },
  employment: {
    title: 'Employment Contract & Workplace Rights',
    category: 'Employment Lawyer',
    text: 'Under Indian Labour & Employment Laws:\n1. Termination Notice: Employers must provide statutory notice or severance pay.\n2. Non-Compete Clauses: Unreasonable post-employment non-compete clauses are void under Section 27 of Contract Act.\n3. POSH Compliance: Workplace harassment protection and internal committee inquiry.',
    citation: 'Industrial Disputes Act & Contract Act 1872',
  },
}

const INITIAL_MSGS = [
  {
    id: 1,
    role: 'assistant',
    text: 'Namaste! I am Kanoon-Mate — your Indian legal query assistant. Ask me anything about Rent Agreements, Consumer Forum filings, BNSS/IPC sections, or Cheque dishonour rules.',
    citation: 'Kanoon-Mate Knowledgebase v2.4',
    category: 'Civil Lawyer',
  },
]

const PROMPT_CHIPS = [
  { label: 'What are my rights as a tenant?', key: 'tenant' },
  { label: 'Explain Section 138 of NI Act (Cheque Bounce)', key: 'cheque' },
  { label: 'How to file a consumer refund complaint?', key: 'consumer' },
  { label: 'What is Zero FIR under BNSS 2023?', key: 'fir' },
]

export default function AIChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(INITIAL_MSGS)
  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [showRecorder, setShowRecorder] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [voicePrefs, setVoicePrefs] = useState(getStoredVoiceSettings)

  const bottomRef = useRef(null)
  const { speak } = useSpeechSynthesis()

  const initials = user?.name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() ?? 'U'

  useEffect(() => {
    setVoicePrefs(getStoredVoiceSettings())
  }, [showSettings])

  const getSmartResponse = (queryText) => {
    const q = queryText.toLowerCase()
    if (q.includes('tenant') || q.includes('rent') || q.includes('evict') || q.includes('deposit') || q.includes('lease')) {
      return KNOWLEDGE_RESPONSES.tenant
    }
    if (q.includes('138') || q.includes('cheque') || q.includes('bounce') || q.includes('money') || q.includes('debt')) {
      return KNOWLEDGE_RESPONSES.cheque
    }
    if (q.includes('consumer') || q.includes('refund') || q.includes('complaint') || q.includes('defective') || q.includes('fraud')) {
      return KNOWLEDGE_RESPONSES.consumer
    }
    if (q.includes('fir') || q.includes('police') || q.includes('bnss') || q.includes('crpc') || q.includes('arrest') || q.includes('bail')) {
      return KNOWLEDGE_RESPONSES.fir
    }
    if (q.includes('employment') || q.includes('salary') || q.includes('employer') || q.includes('job') || q.includes('contract')) {
      return KNOWLEDGE_RESPONSES.employment
    }
    return {
      title: 'Legal Analysis for Indian Jurisdictions',
      category: 'Civil Lawyer',
      text: `Under Indian Statutory Framework regarding "${queryText}":\n• It is recommended to verify statutory timelines and issue formal written notice.\n• Keep certified copies of all written communications and transactional receipts.\n• Consult a registered advocate for formal court filing and representation.`,
      citation: 'General Indian Legal Procedure',
    }
  }

  const handleSend = (overrideText) => {
    const text = (overrideText || input).trim()
    if (!text) return

    const userMsg = { id: Date.now(), role: 'user', text }
    const smart = getSmartResponse(text)
    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      text: smart.text,
      title: smart.title,
      citation: smart.citation,
      category: smart.category,
    }

    setMessages((prev) => [...prev, userMsg, aiMsg])
    setInput('')
    setShowRecorder(false)

    // Auto-play speech if enabled in voice settings
    if (voicePrefs.autoPlay) {
      setTimeout(() => {
        speak(smart.text, { lang: voicePrefs.lang, rate: voicePrefs.rate })
      }, 300)
    }

    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleVoiceSend = (transcriptText) => {
    handleSend(transcriptText)
  }

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-start justify-between gap-4 mb-2">
        <PageHeader
          title="AI Legal Query Assistant"
          subtitle="Get instant explanations on Indian Acts, BNSS/IPC sections, and citizen rights."
        />
        <button
          onClick={() => setShowSettings(true)}
          className="btn-ghost text-xs gap-1.5 border border-[var(--color-border)] rounded-xl mt-1 shrink-0"
          title="Voice Preferences"
        >
          <Settings2 size={15} /> Voice Settings
        </button>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 overflow-y-auto card p-4 sm:p-6 space-y-4 mb-4 border border-[var(--color-border)] shadow-xs rounded-2xl bg-[var(--color-surface)]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant'
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-xs ${
                    isAI
                      ? 'bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {isAI ? <Bot size={17} /> : initials}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'bg-[var(--color-surface-alt)] border border-[var(--color-border-light)] text-[var(--color-text)] shadow-xs'
                      : 'bg-[var(--color-primary)] text-white font-medium'
                  }`}
                >
                  {msg.title && (
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--color-border-light)]">
                      <span className="font-bold text-[var(--color-primary-dark)] text-xs flex items-center gap-1.5">
                        <Scale size={14} className="text-[var(--color-primary)]" /> {msg.title}
                      </span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] p-1 rounded transition-colors"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Read Aloud Voice Player & Advocate Recommendation CTA */}
                  {isAI && (
                    <div className="mt-3 pt-2.5 border-t border-[var(--color-border-light)] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <VoicePlayer
                          text={msg.text}
                          lang={voicePrefs.lang}
                          rate={voicePrefs.rate}
                        />
                        {msg.citation && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-primary)]">
                            <BookOpen size={12} /> {msg.citation}
                          </span>
                        )}
                      </div>

                      {/* Recommend Advocate CTA Button */}
                      <Link
                        to={`/dashboard/advocates?category=${encodeURIComponent(msg.category || 'Civil Lawyer')}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
                      >
                        <Users size={13} />
                        <span>Find Recommended Advocates</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  )}

                  {!isAI && (
                    <div className="mt-2 text-right">
                      <span className="text-[10px] text-white/70">Sent</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Voice Recorder Overlay Widget */}
      <AnimatePresence>
        {showRecorder && (
          <div className="mb-3">
            <VoiceRecorder
              defaultLang={voicePrefs.lang}
              onSend={handleVoiceSend}
              onClose={() => setShowRecorder(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Sample Suggestion Chips */}
      {!showRecorder && (
        <div className="flex flex-wrap gap-2 mb-3">
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip.key}
              onClick={() => handleSend(chip.label)}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-100)] transition-colors shadow-xs"
            >
              <Sparkles size={12} className="text-[var(--color-primary)]" />
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2">
        {/* Voice Recording Button */}
        <VoiceButton
          isListening={showRecorder}
          onClick={() => setShowRecorder((prev) => !prev)}
        />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Kanoon-Mate or click mic to speak..."
          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all shadow-xs"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-xs transition-all disabled:opacity-40"
          title="Send message"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Voice Settings Modal */}
      <VoiceSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={(updated) => setVoicePrefs(updated)}
      />
    </div>
  )
}
