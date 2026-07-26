import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  FileText,
  Bot,
  FileCheck2,
  CalendarClock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import AdminStatCard from '../../components/admin/AdminStatCard'
import ChartWidget from '../../components/admin/ChartWidget'
import { adminAPI } from '../../services/api'
import { mockDocuments } from '../../data/mockData'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { globalSearch } = useOutletContext() || {}
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI
      .getAnalytics()
      .then((res) => {
        if (res.data?.data) {
          setData(res.data.data)
        }
      })
      .catch(() => {
        // Fallback demo data if backend is offline
        setData({
          overview: {
            totalUsers: 148,
            activeUsers: 132,
            totalDocuments: 412,
            aiAnalyses: 389,
            reportsGenerated: 340,
            totalDeadlines: 195,
            failedOCR: 4,
          },
          charts: {
            dailyUploads: [
              { day: 'Mon', uploads: 34, aiProcessed: 32 },
              { day: 'Tue', uploads: 45, aiProcessed: 42 },
              { day: 'Wed', uploads: 62, aiProcessed: 58 },
              { day: 'Thu', uploads: 51, aiProcessed: 49 },
              { day: 'Fri', uploads: 78, aiProcessed: 75 },
              { day: 'Sat', uploads: 90, aiProcessed: 88 },
              { day: 'Sun', uploads: 52, aiProcessed: 45 },
            ],
            aiUsageByCategory: [
              { category: 'Rent Agreement', count: 145 },
              { category: 'Legal Notice', count: 98 },
              { category: 'Employment Contract', count: 76 },
              { category: 'Sale Deed', count: 54 },
              { category: 'FIR / BNSS Audit', count: 39 },
            ],
            documentTypesDistribution: [
              { name: 'Rent Agreements', value: 35, color: '#3B82F6' },
              { name: 'Legal Notices', value: 25, color: '#6366F1' },
              { name: 'Contracts', value: 20, color: '#8B5CF6' },
              { name: 'Sale Deeds', value: 12, color: '#EC4899' },
              { name: 'Other Claims', value: 8, color: '#64748B' },
            ],
            monthlyGrowth: [
              { month: 'Jan', users: 20, docs: 45 },
              { month: 'Feb', users: 45, docs: 110 },
              { month: 'Mar', users: 70, docs: 190 },
              { month: 'Apr', users: 95, docs: 260 },
              { month: 'May', users: 120, docs: 340 },
              { month: 'Jun', users: 148, docs: 412 },
            ],
          },
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  const { overview, charts } = data || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Platform Executive Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time SaaS monitoring for LawAssist AI (Users, AI usage, OCR errors, & Legal Services)
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/analytics')}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0 self-start sm:self-center"
        >
          <span>Deep Analytics</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 6 Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <AdminStatCard title="Total Users" value={overview?.totalUsers} trend={12} icon={Users} color="indigo" />
        <AdminStatCard title="Documents" value={overview?.totalDocuments} trend={18} icon={FileText} color="blue" />
        <AdminStatCard title="AI Analyses" value={overview?.aiAnalyses} trend={15} icon={Bot} color="purple" />
        <AdminStatCard title="Reports" value={overview?.reportsGenerated} trend={9} icon={FileCheck2} color="emerald" />
        <AdminStatCard title="Deadlines" value={overview?.totalDeadlines} trend={5} icon={CalendarClock} color="amber" />
        <AdminStatCard title="Failed OCR" value={overview?.failedOCR} trend={-2} icon={AlertTriangle} color="red" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget
          title="Daily Document Uploads & AI Processing"
          subtitle="7-day document throughput and AI pipeline velocity"
          type="line"
          data={charts?.dailyUploads}
          categoryKey="day"
          dataKey="uploads"
          colors={['#4F46E5', '#10B981']}
        />

        <ChartWidget
          title="AI Usage by Legal Document Category"
          subtitle="Distribution of user document classifications"
          type="bar"
          data={charts?.aiUsageByCategory}
          categoryKey="category"
          dataKey="count"
          colors={['#6366F1']}
        />

        <ChartWidget
          title="Document Format Breakdown"
          subtitle="Percentage distribution across agreement types"
          type="pie"
          data={charts?.documentTypesDistribution}
          categoryKey="name"
          dataKey="value"
        />

        <ChartWidget
          title="Monthly Platform Growth Trends"
          subtitle="User registration and document volume trajectory"
          type="area"
          data={charts?.monthlyGrowth}
          categoryKey="month"
          dataKey="docs"
          colors={['#4F46E5']}
        />
      </div>

      {/* Recent Activity Table Preview */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Document Upload Activity</h3>
          <button
            onClick={() => navigate('/admin/documents')}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            View All Documents
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-semibold">
                <th className="p-3">Document Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Uploaded On</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {mockDocuments.slice(0, 4).map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-indigo-900">{doc.name}</td>
                  <td className="p-3">{doc.type}</td>
                  <td className="p-3 font-mono">{doc.uploadedOn}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 size={12} /> {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
