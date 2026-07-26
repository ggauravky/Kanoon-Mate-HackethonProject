import { motion } from 'framer-motion'
import { MessageSquare, Clock } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SectionCard from '../../components/common/SectionCard'
import { mockChatHistory } from '../../data/mockData'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function History() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="History"
        subtitle="Review your past AI conversations and document analyses."
      />

      <SectionCard title="AI Chat History">
        <div className="space-y-3">
          {mockChatHistory.map((chat, i) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="flex items-start gap-3 rounded-xl border border-[var(--color-border-light)] p-4 hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-50)]">
                <MessageSquare size={16} className="text-[var(--color-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--color-text)] truncate">{chat.title}</p>
                  <span className="text-xs text-[var(--color-text-muted)] shrink-0 flex items-center gap-1">
                    <Clock size={11} />
                    {formatDate(chat.date)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-muted)] truncate">{chat.lastMessage}</p>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{chat.messages} messages</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
