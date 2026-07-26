import { useState } from 'react'
import { Settings, Lock, Bell, Shield, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdvocateSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [matchAlerts, setMatchAlerts] = useState(true)

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Account settings saved successfully!')
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="text-indigo-400" /> Advocate Account Settings
        </h1>
        <p className="text-xs text-slate-400">
          Manage password security, AI notification preferences, and privacy controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Preferences */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Bell size={15} /> Notification & Alert Preferences
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-200">Instant Email Notification on New AI Client Match</span>
              <input
                type="checkbox"
                checked={matchAlerts}
                onChange={(e) => setMatchAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-200">Weekly Performance Analytics Digest</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Lock size={15} /> Change Account Password
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Save size={15} /> Save Settings
        </button>
      </form>
    </div>
  )
}
