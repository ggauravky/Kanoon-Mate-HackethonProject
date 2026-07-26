import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, BookOpen, CheckCircle, Lightbulb, Languages, Scale } from 'lucide-react'

const JARGON_EXAMPLES = [
  {
    id: 'force-majeure',
    term: 'Force Majeure Clause',
    sourceText: 'Neither party shall be held liable for failure or delay in fulfilling obligations hereunder if such failure arises out of acts of God, war, civil commotion, or pandemic outbreak beyond reasonable control.',
    plainEnglish: 'If an unexpected disaster happens (like a pandemic or flood), neither you nor the other party will be penalized for delays.',
    plainHindi: 'यदि कोई प्राकृतिक आपदा या महामारी आती है, तो देरी होने पर किसी भी पक्ष पर जुर्माना नहीं लगेगा।',
    riskLevel: 'Low Risk',
    category: 'Contracts & Rent',
  },
  {
    id: 'indemnity',
    term: 'Indemnification & Hold Harmless',
    sourceText: 'The Lessee covenants to indemnify, defend and hold harmless the Lessor from any losses, damages, claims or legal fees incurred as a consequence of third-party litigation arising from premises usage.',
    plainEnglish: 'If someone sues the property owner because of something you did in the house, you have to pay for all legal costs and damages.',
    plainHindi: 'यदि आपके किसी काम की वजह से मकान मालिक पर मुकदमा होता है, तो पूरा कानूनी खर्च आपको उठाना होगा।',
    riskLevel: 'High Risk Alert ⚠️',
    category: 'Rent & Lease',
  },
  {
    id: 'sec-138',
    term: 'Section 138 NI Act (Cheque Dishonour)',
    sourceText: 'Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount is returned by the bank unpaid, such person shall be deemed to have committed an offence.',
    plainEnglish: 'If a cheque bounces due to insufficient funds, it is a criminal offence punishable by up to 2 years imprisonment or double the cheque amount in fine.',
    plainHindi: 'चेक बाउंस होना एक आपराधिक अपराध है, जिसमें 2 साल की सजा या दोगुना जुर्माना हो सकता है।',
    riskLevel: 'Criminal Offence Alert ⚠️',
    category: 'Banking & Money',
  },
  {
    id: 'bnss-bailable',
    term: 'Bailable vs Non-Bailable Offence (BNSS / CrPC)',
    sourceText: 'Offences designated as bailable under Schedule I entitle the accused to bail as a matter of legal right upon furnishing sureties, whereas non-bailable offences vest judicial discretion in the Magistrate.',
    plainEnglish: 'In a bailable offence, getting bail at the police station is your absolute right. In a non-bailable offence, only a judge can grant bail.',
    plainHindi: 'जमानती अपराध में थाने से ही जमानत मिलना आपका अधिकार है, गैर-जमानती में जज तय करते हैं।',
    riskLevel: 'Rights Protection',
    category: 'Criminal Law (BNSS)',
  },
]

export default function LegalTranslatorWidget() {
  const [selectedId, setSelectedId] = useState('force-majeure')
  const [lang, setLang] = useState('en') // 'en' | 'hi'

  const activeItem = JARGON_EXAMPLES.find((item) => item.id === selectedId) || JARGON_EXAMPLES[0]

  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <Sparkles size={14} /> Interactive Live Demo
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            See How Kanoon-Mate Converts Jargon into Plain Words
          </h3>
          <p className="text-xs text-slate-400 mt-1">Select a complex legal term below to see instant transformation</p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-800 p-1 border border-slate-700/80 shrink-0">
          <Languages size={15} className="ml-2 text-slate-400" />
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              lang === 'en' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              lang === 'hi' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Select Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {JARGON_EXAMPLES.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 ${
              selectedId === item.id
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>{item.term}</span>
          </button>
        ))}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Complex Legal Text */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 relative">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale size={14} /> Raw Complex Legal Jargon
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              {activeItem.category}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed italic bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            "{activeItem.sourceText}"
          </p>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Hard to understand for ordinary citizens without a lawyer.
          </div>
        </div>

        {/* Right: Kanoon-Mate Plain Explanation */}
        <motion.div
          key={activeItem.id + lang}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 relative"
        >
          <div className="flex items-center justify-between mb-3 border-b border-indigo-500/20 pb-3">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} /> Kanoon-Mate Plain Explanation
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
              activeItem.riskLevel.includes('High') || activeItem.riskLevel.includes('Criminal')
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {activeItem.riskLevel}
            </span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-indigo-500/30 text-sm text-slate-100 font-medium leading-relaxed shadow-inner">
            {lang === 'en' ? activeItem.plainEnglish : activeItem.plainHindi}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-indigo-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-emerald-400" />
              <span>Simplified for non-lawyers</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Lightbulb size={13} className="text-amber-400" />
              <span>Instant AI Action Tip Included</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
