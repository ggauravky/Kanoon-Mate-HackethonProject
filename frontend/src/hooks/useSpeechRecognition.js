import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom React Hook for Web Speech API - Speech Recognition (Speech-to-Text)
 * 
 * Supports:
 * - Browser feature detection (SpeechRecognition / webkitSpeechRecognition)
 * - Language selection ('en-IN', 'hi-IN')
 * - Real-time transcript & interim transcript updates
 * - Error & permission handling
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check browser support for SpeechRecognition or webkitSpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      const instance = new SpeechRecognition()
      instance.continuous = true
      instance.interimResults = true

      instance.onresult = (event) => {
        let finalStr = ''
        let interimStr = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalStr += result[0].transcript
          } else {
            interimStr += result[0].transcript
          }
        }

        if (finalStr) {
          setTranscript((prev) => (prev ? `${prev} ${finalStr}` : finalStr))
        }
        setInterimTranscript(interimStr)
      }

      instance.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error)
        if (event.error === 'not-allowed') {
          setError('Microphone permission denied. Please allow microphone access in your browser settings.')
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please speak clearly into the microphone.')
        } else if (event.error === 'network') {
          setError('Speech recognition network error. Please check your internet connection.')
        } else {
          setError(`Speech recognition error: ${event.error}`)
        }
        setIsListening(false)
      }

      instance.onend = () => {
        setIsListening(false)
        setInterimTranscript('')
      }

      recognitionRef.current = instance
    } else {
      setIsSupported(false)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {
          // ignore cleanup errors
        }
      }
    }
  }, [])

  const startListening = useCallback(({ lang = 'en-IN' } = {}) => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser.')
      return
    }

    setError(null)
    setInterimTranscript('')

    try {
      recognitionRef.current.lang = lang
      recognitionRef.current.start()
      setIsListening(true)
    } catch (err) {
      // Handles case if recognition is already running
      if (err.name === 'InvalidStateError') {
        try {
          recognitionRef.current.stop()
          setTimeout(() => {
            recognitionRef.current.start()
            setIsListening(true)
          }, 100)
        } catch {
          setError('Failed to restart speech recognition.')
        }
      } else {
        setError(err.message || 'Failed to start speech recognition.')
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch {
        // ignore error
      }
      setIsListening(false)
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}
