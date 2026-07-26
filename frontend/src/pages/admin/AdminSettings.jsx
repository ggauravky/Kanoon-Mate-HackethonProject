import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, ShieldCheck, Database, Save, Lock, Cpu } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [maxUploadMB, setMaxUploadMB] = useState(20)
  const [ocrEngine, setOcrEngine] = useState('tesseract')
  const [aiModel, setAiModel] = useState('gemini-2.5-flash')

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Admin platform settings updated successfully!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto pb-12"
    >
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure global platform limits, AI engine defaults, and system security thresholds.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
            <Cpu size={16} /> AI & Processing Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Default AI LLM Model
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              >
                <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Default)</option>
                <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (Deep Analysis)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary OCR Engine
              </label>
              <select
                value={ocrEngine}
                onChange={(e) => setOcrEngine(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              >
                <option value="tesseract">Tesseract.js OCR (Multilingual)</option>
                <option value="pdf-parse">pdf-parse Engine</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
            <Database size={16} /> Storage & Security Limits
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Max Upload Limit per Document (MB)
            </label>
            <input
              type="number"
              value={maxUploadMB}
              onChange={(e) => setMaxUploadMB(e.target.value)}
              className="w-full sm:w-48 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <button type="submit" className="flex items-center gap-2 btn-primary text-xs">
          <Save size={15} /> Save Settings
        </button>
      </form>
    </motion.div>
  )
}
