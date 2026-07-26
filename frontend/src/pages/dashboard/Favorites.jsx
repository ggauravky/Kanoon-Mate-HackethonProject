import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, ArrowLeft, Trash2, AlertCircle } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import ServiceCard from '../../components/legalHelp/ServiceCard'
import toast from 'react-hot-toast'

export default function Favorites() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])

  const FAVORITES_KEY = 'kanoon_mate_favorite_services'

  const loadFavorites = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
      setFavorites(saved)
    } catch {
      setFavorites([])
    }
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  const handleClearAll = () => {
    if (!window.confirm('Are you sure you want to clear all bookmarked legal services?')) return
    localStorage.removeItem(FAVORITES_KEY)
    setFavorites([])
    toast.success('All bookmarks cleared')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl mx-auto pb-12"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/legal-help')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Legal Help Directory
        </button>

        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            <Trash2 size={14} /> Clear All Bookmarks
          </button>
        )}
      </div>

      <PageHeader
        title="Saved Legal Resources & Bookmarks"
        subtitle="Manage your bookmarked advocates, government legal aid cells, and emergency contacts"
      />

      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-4 max-w-md mx-auto">
          <Bookmark size={44} className="mx-auto text-amber-400" />
          <h3 className="text-base font-bold text-slate-900">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-slate-500">
            Click the bookmark icon on any legal service card in the directory to save it for quick offline access.
          </p>
          <Link to="/dashboard/legal-help" className="inline-flex items-center gap-2 btn-primary text-xs mx-auto">
            <ArrowLeft size={14} /> Browse Legal Help Directory
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((service) => (
            <ServiceCard
              key={service._id || service.id}
              service={service}
              onBookmarkToggle={loadFavorites}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
