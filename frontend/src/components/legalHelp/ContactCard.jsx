import { Phone, Mail, Globe, Clock, MapPin, ShieldCheck } from 'lucide-react'

export default function ContactCard({ service }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <ShieldCheck size={16} className="text-indigo-600" /> Direct Contact Information
      </h3>

      <div className="space-y-3.5 divide-y divide-slate-100 text-xs">
        {service.phone && (
          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-slate-500 flex items-center gap-2">
              <Phone size={14} className="text-indigo-600" /> Phone Helpline
            </span>
            <a
              href={`tel:${service.phone}`}
              className="font-mono font-bold text-indigo-600 hover:underline"
            >
              {service.phone}
            </a>
          </div>
        )}

        {service.email && (
          <div className="pt-3 flex items-center justify-between gap-3">
            <span className="text-slate-500 flex items-center gap-2">
              <Mail size={14} className="text-indigo-600" /> Email Address
            </span>
            <a
              href={`mailto:${service.email}`}
              className="font-semibold text-slate-900 hover:underline truncate max-w-[180px]"
              title={service.email}
            >
              {service.email}
            </a>
          </div>
        )}

        {service.website && (
          <div className="pt-3 flex items-center justify-between gap-3">
            <span className="text-slate-500 flex items-center gap-2">
              <Globe size={14} className="text-indigo-600" /> Official Portal
            </span>
            <a
              href={service.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 hover:underline truncate max-w-[180px]"
            >
              Visit Website ↗
            </a>
          </div>
        )}

        {service.workingHours && (
          <div className="pt-3 flex items-center justify-between gap-3">
            <span className="text-slate-500 flex items-center gap-2">
              <Clock size={14} className="text-indigo-600" /> Working Hours
            </span>
            <span className="font-semibold text-slate-900">{service.workingHours}</span>
          </div>
        )}

        {service.address && (
          <div className="pt-3 space-y-1">
            <span className="text-slate-500 flex items-center gap-2">
              <MapPin size={14} className="text-indigo-600" /> Official Address
            </span>
            <p className="font-medium text-slate-800 leading-relaxed pl-6">
              {service.address}, {service.city}, {service.state}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
