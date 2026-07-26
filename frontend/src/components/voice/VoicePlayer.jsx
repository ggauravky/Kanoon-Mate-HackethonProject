import { motion } from 'framer-motion'
import { Play, Pause, Square, RotateCcw, Volume2 } from 'lucide-react'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'

/**
 * VoicePlayer — Text-to-Speech audio control bar with speaking wave animation.
 * 
 * Props:
 * - text {string} - Text to be read aloud
 * - lang {string} - 'en-IN' | 'hi-IN'
 * - rate {number} - Speaking speed (default 1)
 * - autoPlay {boolean}
 * - className {string}
 */
export default function VoicePlayer({
  text,
  lang = 'en-IN',
  rate = 1,
  className = '',
}) {
  const {
    supported,
    isSpeaking,
    isPaused,
    speak,
    pause,
    resume,
    stop,
    replay,
  } = useSpeechSynthesis()

  if (!supported || !text) return null

  const handlePlayPause = () => {
    if (isSpeaking) {
      if (isPaused) {
        resume()
      } else {
        pause()
      }
    } else {
      speak(text, { lang, rate })
    }
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-alt)] p-1 px-2.5 text-xs ${className}`}
    >
      {/* Play / Pause Button */}
      <button
        type="button"
        onClick={handlePlayPause}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)] hover:bg-[var(--color-primary-100)] transition-colors"
        title={isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Listen Read Aloud'}
        aria-label={isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Read Aloud'}
      >
        {isSpeaking && !isPaused ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
      </button>

      {/* Replay Button */}
      <button
        type="button"
        onClick={() => replay({ lang, rate })}
        className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
        title="Replay Audio"
        aria-label="Replay"
      >
        <RotateCcw size={13} />
      </button>

      {/* Stop Button */}
      {isSpeaking && (
        <button
          type="button"
          onClick={stop}
          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          title="Stop Audio"
          aria-label="Stop"
        >
          <Square size={12} />
        </button>
      )}

      {/* Speaking Sound Wave Animation */}
      {isSpeaking && !isPaused && (
        <div className="flex items-center gap-0.5 px-1.5 py-1">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              animate={{ height: ['4px', '14px', '4px'] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
              className="w-0.5 rounded-full bg-[var(--color-primary)]"
            />
          ))}
        </div>
      )}

      {!isSpeaking && (
        <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-text-muted)] pl-0.5">
          <Volume2 size={13} /> Listen
        </span>
      )}
    </div>
  )
}
