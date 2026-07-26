import { NavLink, useNavigate } from 'react'
import {
  LayoutDashboard,
  Users,
  FileText,
  FileCheck2,
  HeartHandshake,
  Bell,
  LineChart,
  Settings,
  ShieldCheck,
  ArrowLeft,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ADMIN_NAV_ITEMS = [
  { id: 'admin-overview', label: 'Overview', icon: LayoutDashboard, to: '/admin', end: true },
  { id: 'admin-users', label: 'Users', icon: Users, to: '/admin/users' },
  { id: 'admin-docs', label: 'Documents', icon: FileText, to: '/admin/documents' },
  { id: 'admin-reports', label: 'Reports', icon: FileCheck2, to: '/admin/reports' },
  { id: 'admin-services', label: 'Legal Services', icon: HeartHandshake, to: '/admin/legal-services' },
  { id: 'admin-notifs', label: 'Notifications', icon: Bell, to: '/admin/notifications' },
  { id: 'admin-analytics', label: 'Analytics', icon: LineChart, to: '/admin/analytics' },
  { id: 'admin-settings', label: 'Settings', icon: Settings, to: '/admin/settings' },
]

export default function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out from Admin Console.')
    navigate('/')
  }

  return (
    <aside className="w-60 bg-slate-950 text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block">Kanoon-Mate</span>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <item.icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Exit to App</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 transition-colors"
        >
          <LogOut size={16} />
          <span>Admin Logout</span>
        </button>
      </div>
    </aside>
  )
}
