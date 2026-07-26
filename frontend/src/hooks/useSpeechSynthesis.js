import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom React Hook for Web Speech API - Speech Synthesis (Text-to-Speech)
 * 
 * Features:
 * - Play, Pause, Resume, Stop, Replay
 * - Hindi (hi-IN) and English (en-IN / en-US) voice selection
 * - Speed rate & pitch adjustments
 * - Speaking indicator state
 */
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [voices, setVoices] = useState([])
  const [supported, setSupported] = useState(false)

  const utteranceRef = useRef(null)

  // Load available system voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true)

      const loadVoices = () => {
        const available = window.speechSynthesis.getVoices()
        setVoices(available)
      }

      loadVoices()

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    } else {
      setSupported(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }, [])

  const speak = useCallback(
    (text, { lang = 'en-IN', rate = 1, pitch = 1, voice = null } = {}) => {
      if (!supported || !text) return

      stop() // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.lang = lang

      // Attempt to find best matching voice
      if (voice) {
        utterance.voice = voice
      } else if (voices.length > 0) {
        // Preferred voice matching language code (e.g., 'hi-IN' or 'en-IN')
        const matched = voices.find(
          (v) => v.lang === lang || v.lang.startsWith(lang.split('-')[0])
        )
        if (matched) utterance.voice = matched
      }

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
        setCurrentText(text)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
      }

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e)
        setIsSpeaking(false)
        setIsPaused(false)
      }

      utterance.onpause = () => {
        setIsPaused(true)
      }

      utterance.onresume = () => {
        setIsPaused(false)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [supported, voices, stop]
  )

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isSpeaking) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [isSpeaking])

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [isPaused])

  const replay = useCallback(
    (options = {}) => {
      if (currentText) {
        speak(currentText, options)
      }
    },
    [currentText, speak]
  )

  return {
    supported,
    isSpeaking,
    isPaused,
    currentText,
    voices,
    speak,
    pause,
    resume,
    stop,
    replay,
  }
}
