import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Home, ShoppingBag, Briefcase, PhoneCall, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react'

const CITIZEN_RIGHTS_DATA = [
  {
    id: 'tenant-rights',
    title: 'Tenant Protection & Rent Control Act',
    icon: Home,
    badge: 'Real Estate & Rent',
    summary: 'Landlords cannot evict you without a 30-day notice or arbitrarily raise rent during an active lease agreement.',
    details: [
      'Landlord must return security deposit within 30 days of vacating after accounting for legitimate repair deductions.',
      'Electricity & water supplies cannot be cut off by landlord even during disputes.',
      'Landlords require 24-48 hours advance notice before entering rented premises.',
    ],
  },
  {
    id: 'consumer-rights',
    title: 'Consumer Protection Act 2019',
    icon: ShoppingBag,
    badge: 'Disputes & Refunds',
    summary: 'File direct online complaints on e-Daakhil / NCH against defective products, e-commerce scams, or non-responsive companies.',
    details: [
      'No lawyer required for filing cases up to ₹50 Lakhs in District Consumer Commission.',
      'Product liability includes compensation for physical harm or financial loss caused by defective items.',
      'E-commerce platforms are legally required to accept returns for defective items within stipulated timelines.',
    ],
  },
  {
    id: 'workplace-posh',
    title: 'Workplace & POSH Act Rights',
    icon: Briefcase,
    badge: 'Employment Rights',
    summary: 'Protection against unfair termination, unpaid dues, and mandatory Internal Complaints Committee (ICC) for women safety.',
    details: [
      'Employers must settle Full & Final (F&F) accounts within 45 days of resignation or notice period end.',
      'Every company with 10+ employees must maintain a POSH Internal Committee.',
      'Maternity Benefit Act provides 26 weeks paid leave for female employees.',
    ],
  },
  {
    id: 'police-bnss-fir',
    title: 'Police Arrest & FIR Rights (BNSS / CrPC)',
    icon: ShieldAlert,
    badge: 'Criminal Procedure',
    summary: 'Know your rights during police questioning, zero FIR filing, and mandatory medical examination.',
    details: [
      'Zero FIR: Any police station must record an FIR regardless of jurisdiction location.',
      'Women cannot be arrested after sunset (6 PM) and before sunrise (6 AM) without special judicial permission.',
      'You have the right to inform a family member and request an advocate during police custody.',
    ],
  },
]

export default function CitizenRightsWidget() {
  const [expandedId, setExpandedId] = useState('tenant-rights')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {CITIZEN_RIGHTS_DATA.map((item) => {
        const IconComponent = item.icon
        const isExpanded = expandedId === item.id

        return (
          <motion.div
            key={item.id}
            layout
            onClick={() => setExpandedId(isExpanded ? null : item.id)}
            className={`cursor-pointer rounded-2xl border p-5 transition-all ${
              isExpanded
                ? 'border-indigo-500 bg-slate-900/90 shadow-xl ring-1 ring-indigo-500/30'
                : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                  <IconComponent size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
                    {item.badge}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{item.title}</h4>
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-indigo-400' : ''}`}
              />
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">{item.summary}</p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-800 space-y-2"
                >
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Key Provisions & Statutory Protection:</p>
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
