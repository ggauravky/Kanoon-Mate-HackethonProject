import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UserCheck,
  ShieldCheck,
  Building,
  DollarSign,
  Briefcase,
  Globe,
  Award,
  BookOpen,
  MapPin,
  Save,
  Plus,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { advocateAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdvocateProfileManage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    fullName: user?.name || '',
    barCouncilNumber: 'BCI-DL-88412',
    experience: 8,
    city: user?.city || 'Delhi',
    state: user?.state || 'Delhi',
    officeAddress: 'Chamber 402, Lawyers Block, High Court of Delhi',
    consultationFee: 2000,
    bio: 'Senior Legal Practitioner specializing in Property Disputes, Corporate Compliance, and Civil Litigation with over 8 years of court experience.',
    practiceAreas: ['Property Lawyer', 'Corporate Lawyer', 'Civil Lawyer'],
    languages: ['English', 'Hindi', 'Punjabi'],
    courtExperience: ['Supreme Court of India', 'Delhi High Court', 'District & Sessions Court'],
    achievements: ['Gold Medalist - LL.B', 'Excellence in Legal Aid 2024'],
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await advocateAPI.getProfile()
      if (res.data?.data?.profile) {
        const p = res.data.data.profile
        setForm({
          fullName: p.user?.fullName || user?.name || '',
          barCouncilNumber: p.barCouncilNumber || '',
          experience: p.experience || 5,
          city: p.city || 'Delhi',
          state: p.state || 'Delhi',
          officeAddress: p.officeAddress || '',
          consultationFee: p.consultationFee || 1500,
          bio: p.bio || '',
          practiceAreas: p.practiceAreas || [],
          languages: p.languages || [],
          courtExperience: p.courtExperience || [],
          achievements: p.achievements || [],
        })
      }
    } catch (err) {
      console.warn('Profile fetch note:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await advocateAPI.updateProfile(form)
      toast.success('Advocate Profile updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Verified Legal Directory Profile
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Manage Advocate Profile</h1>
          <p className="text-xs text-slate-400">
            Keep your professional profile up to date to maintain high recommendation ranking in LawAssist AI directory.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 text-xs shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Save size={15} />
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      {/* Profile Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <UserCheck size={16} /> Basic Professional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name & Prefix</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bar Council Registration No.</label>
              <input
                type="text"
                value={form.barCouncilNumber}
                onChange={(e) => setForm({ ...form, barCouncilNumber: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Practice Experience</label>
              <input
                type="number"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Consultation Fee (₹)</label>
              <input
                type="number"
                value={form.consultationFee}
                onChange={(e) => setForm({ ...form, consultationFee: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City Jurisdiction</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Office / Chamber Address</label>
            <input
              type="text"
              value={form.officeAddress}
              onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Practice Areas & Specializations */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Briefcase size={16} /> Legal Practice Areas & Specializations
          </h2>

          <div className="flex flex-wrap gap-2">
            {form.practiceAreas.map((area, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold"
              >
                {area}
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      practiceAreas: form.practiceAreas.filter((_, i) => i !== index),
                    })
                  }
                  className="text-slate-400 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}
