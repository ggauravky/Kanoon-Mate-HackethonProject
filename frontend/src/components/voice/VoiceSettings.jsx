import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Languages, Gauge, Sparkles, X, Check } from 'lucide-react'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'

const STORAGE_KEY = 'kanoon_mate_voice_settings'

export function getStoredVoiceSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return {
    lang: 'en-IN',
    rate: 1.0,
    voiceURI: '',
    autoPlay: true,
  }
}

export function saveVoiceSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore
  }
}

/**
 * VoiceSettings — Preferences panel for voice controls.
 * 
 * Props:
 * - isOpen {boolean}
 * - onClose {function}
 * - onSave {function}
 */
export default function VoiceSettings({ isOpen, onClose, onSave }) {
  const { voices } = useSpeechSynthesis()
  const [settings, setSettings] = useState(getStoredVoiceSettings)

  useEffect(() => {
    setSettings(getStoredVoiceSettings())
  }, [isOpen])

  if (!isOpen) return null

  const handleUpdate = (field, value) => {
    const updated = { ...settings, [field]: value }
    setSettings(updated)
    saveVoiceSettings(updated)
    if (onSave) onSave(updated)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="card max-w-md w-full p-6 space-y-6 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
              <Volume2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">Voice Preferences</h3>
              <p className="text-xs text-[var(--color-text-muted)]">Configure speech recognition & read-aloud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Setting 1: Language */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text)]">
            <Languages size={14} className="text-[var(--color-primary)]" /> Preferred Language
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'en-IN', label: 'English (India)' },
              { id: 'hi-IN', label: 'हिंदी (Hindi)' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate('lang', item.id)}
                className={`p-2.5 text-xs font-semibold rounded-xl border flex items-center justify-between transition-all ${
                  settings.lang === item.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-50)] text-[var(--color-primary-dark)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
                }`}
              >
                <span>{item.label}</span>
                {settings.lang === item.id && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 2: Speaking Speed */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text)]">
            <Gauge size={14} className="text-[var(--color-primary)]" /> Speaking Speed (Rate)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => handleUpdate('rate', speed)}
                className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                  settings.rate === speed
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xs'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Setting 3: System Voice Selection */}
        {voices.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text)]">
              <Volume2 size={14} className="text-[var(--color-primary)]" /> System Voice
            </label>
            <select
              value={settings.voiceURI}
              onChange={(e) => handleUpdate('voiceURI', e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-2.5 text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">Default System Voice</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Setting 4: Auto-play toggle */}
        <div className="flex items-center justify-between py-2 border-t border-[var(--color-border-light)]">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[var(--color-text)] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[var(--color-accent)]" /> Auto-play AI Responses
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)]">Read new messages aloud automatically</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.autoPlay}
              onChange={(e) => handleUpdate('autoPlay', e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-5 w-9 rounded-full bg-[var(--color-border)] transition-colors peer-checked:bg-[var(--color-primary)] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </div>

        {/* Close CTA */}
        <button
          onClick={onClose}
          className="btn-primary w-full justify-center text-xs"
        >
          Save Preferences
        </button>
      </motion.div>
    </div>
  )
}
