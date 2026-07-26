import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, User, Sparkles, AlertCircle } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'

const PLACEHOLDER_MSGS = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hello! I\'m your LawAssist AI assistant. I can help you understand Indian laws, analyse legal documents, and answer your legal queries. How can I help you today?',
  },
]

const suggestions = [
  'What are my rights as a tenant?',
  'Explain Section 138 of NI Act',
  'How to file a consumer complaint?',
  'What is a legal notice?',
]

export default function AIChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(PLACEHOLDER_MSGS)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const initials = user?.name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() ?? 'U'

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    const userMsg = { id: Date.now(), role: 'user', text }
    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      text: 'AI chat will be fully functional in Phase 6 after backend integration. This is a UI placeholder to demonstrate the chat interface.',
    }
    setMessages((prev) => [...prev, userMsg, aiMsg])
    setInput('')
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-130px)]">
      <PageHeader
        title="AI Assistant"
        subtitle="Ask legal questions in plain language."
      />

      {/* Phase notice */}
      <div className="flex gap-2.5 rounded-lg bg-[var(--color-warning-50)] border border-[var(--color-warning-100)] p-3 mb-4">
        <AlertCircle size={15} className="text-[var(--color-warning)] shrink-0 mt-0.5" />
        <p className="text-xs text-[#92400E]">
          AI responses are placeholders. Real AI integration arrives in Phase 6.
        </p>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto card p-4 space-y-4 mb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant'
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isAI
                    ? 'bg-[var(--color-primary-50)] text-[var(--color-primary)]'
                    : 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white'
                }`}>
                  {isAI ? <Bot size={15} /> : initials}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isAI
                    ? 'bg-[var(--color-surface-alt)] text-[var(--color-text)]'
                    : 'bg-[var(--color-primary)] text-white'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] px-3 py-1 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-100)] transition-colors"
            >
              <Sparkles size={11} />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a legal question…"
          className="flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
          id="chat-input"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          id="chat-send-btn"
          aria-label="Send message"
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  )
}
