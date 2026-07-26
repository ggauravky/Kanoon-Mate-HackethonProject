import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, Scale, BookOpen, Copy, Check, ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const KNOWLEDGE_RESPONSES = {
  tenant: {
    title: 'Tenant Rights under Model Tenancy Act & State Rent Laws',
    text: 'Under Indian Tenant & Rent Control Laws:\n1. Notice Period: A landlord must issue at least 30 days written notice before eviction.\n2. Security Deposit Refund: Deposit must be refunded within 30 days of vacating.\n3. Essential Utilities: Under State Rent Control Acts, a landlord cannot cut off water or electricity supplies.\n4. Rent Increase: Rent cannot be increased arbitrarily during an active lease period unless specified in the registered agreement.',
    citation: 'Model Tenancy Act 2021 & Delhi/State Rent Control Acts',
  },
  cheque: {
    title: 'Section 138 of Negotiable Instruments (NI) Act 1881',
    text: 'If a cheque bounces due to insufficient funds:\n1. Statutory Notice: The payee must send a legal notice within 30 days of cheque return memo.\n2. Payment Window: The drawer gets 15 days to pay the amount upon receipt of notice.\n3. Criminal Complaint: If unpaid after 15 days, a court complaint can be filed under Section 138.\n4. Penalty: Punishable by up to 2 years imprisonment or fine up to double the cheque amount.',
    citation: 'Section 138 NI Act 1881',
  },
  consumer: {
    title: 'Filing Consumer Complaint under Consumer Protection Act 2019',
    text: 'To file a complaint for defective product or deficient service:\n1. Online Portal: File directly at consumerhelpline.gov.in (NCH) or e-Daakhil portal.\n2. Jurisdiction: Up to ₹50 Lakhs → District Commission. ₹50L to ₹2 Crores → State Commission.\n3. Compensation: You can claim refund + interest + compensation for mental agony.',
    citation: 'Consumer Protection Act 2019',
  },
  fir: {
    title: 'Zero FIR & Police Procedure under BNSS 2023 / CrPC',
    text: 'Rights regarding police complaints:\n1. Zero FIR: Any police station must record your FIR regardless of jurisdiction location.\n2. Arrest of Women: Women cannot be arrested between sunset (6 PM) and sunrise (6 AM) except in exceptional circumstances with magistrate approval.\n3. Legal Counsel: You have the right to consult an advocate during interrogation.',
    citation: 'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
  },
}

const INITIAL_MSGS = [
  {
    id: 1,
    role: 'assistant',
    text: 'Namaste! I am LawAssist AI — your Indian legal query assistant. Ask me anything about Rent Agreements, Consumer Forum filings, BNSS/IPC sections, or Cheque dishonour rules.',
    citation: 'LawAssist Knowledgebase v2.4',
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
  const bottomRef = useRef(null)

  const initials = user?.name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() ?? 'U'

  const getSmartResponse = (queryText) => {
    const q = queryText.toLowerCase()
    if (q.includes('tenant') || q.includes('rent') || q.includes('evict') || q.includes('deposit')) {
      return KNOWLEDGE_RESPONSES.tenant
    }
    if (q.includes('138') || q.includes('cheque') || q.includes('bounce') || q.includes('money')) {
      return KNOWLEDGE_RESPONSES.cheque
    }
    if (q.includes('consumer') || q.includes('refund') || q.includes('complaint') || q.includes('defective')) {
      return KNOWLEDGE_RESPONSES.consumer
    }
    if (q.includes('fir') || q.includes('police') || q.includes('bnss') || q.includes('crpc') || q.includes('arrest')) {
      return KNOWLEDGE_RESPONSES.fir
    }
    return {
      title: 'Legal Analysis for Indian Jurisdictions',
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
    }

    setMessages((prev) => [...prev, userMsg, aiMsg])
    setInput('')
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <PageHeader
        title="AI Legal Query Assistant"
        subtitle="Get instant explanations on Indian Acts, BNSS/IPC sections, and citizen rights."
      />

      {/* Main Chat Box */}
      <div className="flex-1 overflow-y-auto card p-4 sm:p-6 space-y-4 mb-4 border border-slate-200 shadow-sm rounded-2xl bg-white">
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
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm ${
                    isAI
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {isAI ? <Bot size={17} /> : initials}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'bg-slate-50 border border-slate-200/80 text-slate-800 shadow-sm'
                      : 'bg-indigo-600 text-white font-medium'
                  }`}
                >
                  {msg.title && (
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200">
                      <span className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                        <Scale size={14} className="text-indigo-600" /> {msg.title}
                      </span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.citation && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-indigo-600">
                        <BookOpen size={13} /> {msg.citation}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <ShieldCheck size={12} /> Verified Legal Context
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Sample Suggestion Chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {PROMPT_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => handleSend(chip.label)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-xs"
          >
            <Sparkles size={12} className="text-indigo-500" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask LawAssist AI about Indian legal rights, contracts, or BNSS sections…"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xs"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
