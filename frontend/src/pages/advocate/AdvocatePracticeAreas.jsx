import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gavel, Plus, Check, Trash2, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const ALL_AREAS = [
  'Property Lawyer',
  'Family Lawyer',
  'Divorce Lawyer',
  'Cyber Crime Lawyer',
  'Consumer Lawyer',
  'Corporate Lawyer',
  'Tax Lawyer',
  'Constitutional Lawyer',
  'Immigration Lawyer',
  'Criminal Lawyer',
  'Civil Lawyer',
  'Labour & Employment Lawyer',
  'Banking & Finance Lawyer',
  'Intellectual Property Lawyer',
  'Arbitration & Mediation Lawyer',
  'Environmental Lawyer',
  'Motor Accident Claims Lawyer',
  'Cheque Dishonour Specialist',
]

export default function AdvocatePracticeAreas() {
  const [selected, setSelected] = useState(['Property Lawyer', 'Corporate Lawyer', 'Civil Lawyer', 'Cheque Dishonour Specialist'])

  const toggleArea = (area) => {
    if (selected.includes(area)) {
      setSelected(selected.filter((a) => a !== area))
    } else {
      setSelected([...selected, area])
    }
  }

  const handleSave = () => {
    toast.success('Practice areas updated successfully!')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Gavel className="text-indigo-400" /> Manage Practice Areas & Specializations
          </h1>
          <p className="text-xs text-slate-400">
            Select legal specializations to configure your AI Client Matching criteria and directory filters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Check size={15} /> Save Practice Areas
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {ALL_AREAS.map((area) => {
          const isSelected = selected.includes(area)
          return (
            <button
              key={area}
              onClick={() => toggleArea(area)}
              className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/20 text-white border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{area}</span>
              {isSelected ? (
                <Check size={16} className="text-emerald-400" />
              ) : (
                <Plus size={16} className="text-slate-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
