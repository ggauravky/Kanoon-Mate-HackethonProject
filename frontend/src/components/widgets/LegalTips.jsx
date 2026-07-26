import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react'
import { legalTips } from '../../data/legalTips'

const categoryColors = {
  General:    'badge badge-blue',
  Banking:    'badge badge-yellow',
  Property:   'badge badge-green',
  Consumer:   'badge badge-purple',
  Employment: 'badge badge-red',
}

export default function LegalTips() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setIndex((prev) => (prev + 1) % legalTips.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const go = (dir) => {
    setDirection(dir)
    setIndex((prev) => (prev + dir + legalTips.length) % legalTips.length)
  }

  const tip = legalTips[index]

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -24 : 24 }),
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={15} className="text-[var(--color-warning)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Did You Know?
          </span>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">
          {index + 1} / {legalTips.length}
        </span>
      </div>

      {/* Tip */}
      <div className="flex-1 relative overflow-hidden min-h-[80px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={tip.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col gap-2"
          >
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{tip.tip}</p>
            <span className={`${categoryColors[tip.category] ?? 'badge badge-blue'} self-start mt-1`}>
              {tip.category}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => go(-1)}
          className="btn-ghost p-1.5 rounded-lg"
          aria-label="Previous tip"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Dots */}
        <div className="flex gap-1 flex-1 justify-center">
          {legalTips.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-5 bg-[var(--color-primary)]'
                  : 'w-1.5 bg-[var(--color-border)]'
              }`}
              aria-label={`Tip ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          className="btn-ghost p-1.5 rounded-lg"
          aria-label="Next tip"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
