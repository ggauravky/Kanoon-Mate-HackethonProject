import { Scale } from 'lucide-react'
import { motion } from 'framer-motion'
import { APP_NAME, APP_TAGLINE } from '../constants/app'

function HomePage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
        <Scale className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Welcome to {APP_NAME}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600">{APP_TAGLINE}</p>
      <p className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-4 text-sm text-slate-500">
        Frontend foundation is ready. Feature development starts in the next phase.
      </p>
    </motion.section>
  )
}

export default HomePage
