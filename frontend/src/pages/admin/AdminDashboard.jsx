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
  CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminStatCard from '../../components/admin/AdminStatCard'
import ChartWidget from '../../components/admin/ChartWidget'
import { adminAPI, documentsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [recentDocs, setRecentDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    Promise.allSettled([
      adminAPI.getAnalytics(),
      documentsAPI.getDocuments(),
    ]).then(([analyticsRes, docsRes]) => {
      if (!isMounted) return

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data?.data) {
        setData(analyticsRes.value.data.data)
      } else {
        toast.error('Failed to load admin analytics.')
      }

      if (docsRes.status === 'fulfilled' && docsRes.value.data?.data?.documents) {
        setRecentDocs(docsRes.value.data.data.documents.slice(0, 4))
      }
    }).finally(() => {
      if (isMounted) setLoading(false)
    })

    return () => {
      isMounted = false
    }
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
            Real-time SaaS monitoring for Kanoon-Mate (Users, AI usage, OCR errors, & Legal Services)
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/analytics')}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0 self-start sm:self-center cursor-pointer"
        >
          <span>Deep Analytics</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 6 Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <AdminStatCard title="Total Users" value={overview?.totalUsers ?? 0} trend={12} icon={Users} color="indigo" />
        <AdminStatCard title="Documents" value={overview?.totalDocuments ?? 0} trend={18} icon={FileText} color="blue" />
        <AdminStatCard title="AI Analyses" value={overview?.aiAnalyses ?? 0} trend={15} icon={Bot} color="purple" />
        <AdminStatCard title="Reports" value={overview?.reportsGenerated ?? 0} trend={9} icon={FileCheck2} color="emerald" />
        <AdminStatCard title="Deadlines" value={overview?.totalDeadlines ?? 0} trend={5} icon={CalendarClock} color="amber" />
        <AdminStatCard title="Failed OCR" value={overview?.failedOCR ?? 0} trend={-2} icon={AlertTriangle} color="red" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget
          title="Daily Document Uploads & AI Processing"
          subtitle="7-day document throughput and AI pipeline velocity"
          type="line"
          data={charts?.dailyUploads || []}
          categoryKey="day"
          dataKey="uploads"
          colors={['#4F46E5', '#10B981']}
        />

        <ChartWidget
          title="AI Usage by Legal Document Category"
          subtitle="Distribution of user document classifications"
          type="bar"
          data={charts?.aiUsageByCategory || []}
          categoryKey="category"
          dataKey="count"
          colors={['#6366F1']}
        />

        <ChartWidget
          title="Document Format Breakdown"
          subtitle="Percentage distribution across agreement types"
          type="pie"
          data={charts?.documentTypesDistribution || []}
          categoryKey="name"
          dataKey="value"
        />

        <ChartWidget
          title="Monthly Platform Growth Trends"
          subtitle="User registration and document volume trajectory"
          type="area"
          data={charts?.monthlyGrowth || []}
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
            className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            View All Documents
          </button>
        </div>

        {recentDocs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No recent document upload activity.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-semibold">
                  <th className="p-3">Document Title</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Uploaded On</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {recentDocs.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-indigo-900">{doc.title || doc.originalFileName}</td>
                    <td className="p-3 uppercase">{(doc.mimeType || '').split('/')[1] || 'PDF'}</td>
                    <td className="p-3 font-mono">{new Date(doc.createdAt || Date.now()).toLocaleDateString('en-IN')}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 size={12} /> {doc.analysisStatus || doc.ocrStatus || 'Uploaded'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
