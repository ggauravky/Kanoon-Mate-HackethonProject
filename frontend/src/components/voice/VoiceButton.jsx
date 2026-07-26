import { motion } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'

/**
 * VoiceButton — Compact microphone toggle button with animated pulse.
 * 
 * Props:
 * - isListening {boolean}
 * - onClick {function}
 * - isSupported {boolean}
 * - className {string}
 */
export default function VoiceButton({
  isListening = false,
  onClick,
  isSupported = true,
  className = '',
}) {
  if (!isSupported) {
    return (
      <button
        disabled
        title="Speech recognition is not supported in this browser."
        className={`p-2.5 rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed ${className}`}
        aria-label="Speech recognition unsupported"
      >
        <MicOff size={18} />
      </button>
    )
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Animated recording pulse ring */}
      {isListening && (
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-xl bg-red-500/40 pointer-events-none"
        />
      )}

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          isListening
            ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
            : 'bg-[var(--color-primary-50)] text-[var(--color-primary)] hover:bg-[var(--color-primary-100)]'
        } ${className}`}
        title={isListening ? 'Stop Voice Recording' : 'Start Voice Search / Dictation'}
        aria-label={isListening ? 'Stop Recording' : 'Start Recording'}
      >
        <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
      </motion.button>
    </div>
  )
}
