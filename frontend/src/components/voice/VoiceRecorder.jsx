import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Trash2, Globe, AlertCircle } from 'lucide-react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

/**
 * VoiceRecorder — Interactive recording modal / widget with live transcript and language switching.
 * 
 * Props:
 * - onSend {function} - Triggered when user confirms sending transcript
 * - onClose {function} - Triggered to close recorder widget
 * - defaultLang {string} - 'en-IN' | 'hi-IN'
 */
export default function VoiceRecorder({ onSend, onClose, defaultLang = 'en-IN' }) {
  const [lang, setLang] = useState(defaultLang)

  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition()

  useEffect(() => {
    // Auto-start recording on mount if supported
    if (isSupported) {
      startListening({ lang })
    }
  }, [isSupported, lang, startListening])

  const handleToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening({ lang })
    }
  }

  const handleLangChange = (newLang) => {
    setLang(newLang)
    if (isListening) {
      stopListening()
      setTimeout(() => startListening({ lang: newLang }), 150)
    }
  }

  const handleSend = () => {
    const fullText = `${transcript} ${interimTranscript}`.trim()
    if (fullText && onSend) {
      onSend(fullText)
      stopListening()
      resetTranscript()
      if (onClose) onClose()
    }
  }

  if (!isSupported) {
    return (
      <div className="card p-4 text-center space-y-3 bg-red-50 border-red-200">
        <MicOff size={28} className="mx-auto text-red-500" />
        <p className="text-xs text-red-700 font-medium">
          Speech recognition is not supported in your current browser. Please use Chrome, Edge, or Safari.
        </p>
        <button onClick={onClose} className="btn-ghost text-xs border border-red-200 mx-auto">
          Close
        </button>
      </div>
    )
  }

  const combinedText = `${transcript} ${interimTranscript}`.trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      className="card p-4 space-y-4 shadow-xl border-2 border-[var(--color-primary-100)]"
    >
      {/* Top Header: Language Switcher & Controls */}
      <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border-light)] pb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            {isListening && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            )}
            <div className={`p-2 rounded-xl ${isListening ? 'bg-red-100 text-red-600' : 'bg-[var(--color-primary-50)] text-[var(--color-primary)]'}`}>
              <Mic size={16} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text)]">
              {isListening ? 'Listening...' : 'Microphone Paused'}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Speak your legal question</p>
          </div>
        </div>

        {/* Language selector pills */}
        <div className="flex items-center gap-1 bg-[var(--color-surface-alt)] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleLangChange('en-IN')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
              lang === 'en-IN'
                ? 'bg-white text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLangChange('hi-IN')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
              lang === 'hi-IN'
                ? 'bg-white text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-100">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Transcript Display Box */}
      <div className="min-h-[70px] max-h-[140px] overflow-y-auto bg-[var(--color-surface-alt)] p-3 rounded-xl border border-[var(--color-border-light)] text-xs text-[var(--color-text)] leading-relaxed font-medium">
        {combinedText ? (
          <p>
            {transcript}
            {interimTranscript && (
              <span className="text-[var(--color-text-muted)] italic font-normal"> {interimTranscript}</span>
            )}
          </p>
        ) : (
          <p className="text-[var(--color-text-muted)] italic">
            {isListening ? 'Start speaking... Your words will appear here in real time.' : 'Click mic to resume recording.'}
          </p>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {/* Start / Stop Toggle */}
          <button
            type="button"
            onClick={handleToggle}
            className={`btn-ghost text-xs gap-1.5 border ${
              isListening
                ? 'border-red-200 text-red-600 bg-red-50'
                : 'border-[var(--color-border)] text-[var(--color-text)]'
            }`}
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            {isListening ? 'Pause' : 'Record'}
          </button>

          {/* Reset button */}
          {combinedText && (
            <button
              type="button"
              onClick={resetTranscript}
              className="btn-ghost text-xs p-2 text-slate-400 hover:text-red-500"
              title="Clear transcript"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={() => { stopListening(); onClose(); }}
              className="btn-ghost text-xs px-3"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSend}
            disabled={!combinedText}
            className="btn-primary text-xs gap-1.5 disabled:opacity-40"
          >
            <Send size={13} /> Send Voice Input
          </button>
        </div>
      </div>
    </motion.div>
  )
}
