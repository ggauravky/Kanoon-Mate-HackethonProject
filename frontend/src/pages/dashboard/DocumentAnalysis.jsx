import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Bot,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  BookOpen,
  HelpCircle,
  AlertCircle,
  RotateCw,
  Copy,
  FileCheck2,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import SectionCard from '../../components/common/SectionCard'
import VoicePlayer from '../../components/voice/VoicePlayer'
import RecommendationBanner from '../../components/advocates/RecommendationBanner'
import EmergencyWarningBanner from '../../components/guidance/EmergencyWarningBanner'
import ActionPlanTimeline from '../../components/guidance/ActionPlanTimeline'
import RequiredDocumentsChecklist from '../../components/guidance/RequiredDocumentsChecklist'
import EvidenceChecklist from '../../components/guidance/EvidenceChecklist'
import ContactAuthoritiesCard from '../../components/guidance/ContactAuthoritiesCard'
import DeadlineTimeline from '../../components/guidance/DeadlineTimeline'
import MistakesCard from '../../components/guidance/MistakesCard'
import SuggestionsCard from '../../components/guidance/SuggestionsCard'
import LawyerRecommendationCard from '../../components/guidance/LawyerRecommendationCard'
import { documentsAPI, reportsAPI } from '../../services/api'

// ─── Risk Badge Component ───────────────────────────────────────────────────────
function RiskBadge({ level }) {
  const norm = level ? level.toUpperCase() : 'LOW'
  if (norm === 'HIGH') {
    return (
      <span className="badge badge-red text-xs px-3 py-1 gap-1.5 font-semibold">
        <ShieldAlert size={14} /> High Risk Document
      </span>
    )
  }
  if (norm === 'MEDIUM') {
    return (
      <span className="badge badge-yellow text-xs px-3 py-1 gap-1.5 font-semibold">
        <AlertTriangle size={14} /> Medium Risk Document
      </span>
    )
  }
  return (
    <span className="badge badge-green text-xs px-3 py-1 gap-1.5 font-semibold">
      <ShieldCheck size={14} /> Low Risk Document
    </span>
  )
}

export default function DocumentAnalysis() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [docData, setDocData] = useState(null)
  const [error, setError] = useState(null)
  const [checkedActions, setCheckedActions] = useState({})

  const handleGenerateReport = async () => {
    if (!id || id.startsWith('doc_')) {
      toast.success('Generated legal report PDF (Demo Mode)')
      navigate('/dashboard/reports')
      return
    }

    setGeneratingReport(true)
    try {
      const response = await reportsAPI.generatePDFReport(id)
      const sanitizedTitle = (docData?.title || 'Legal_Document').replace(/[^a-zA-Z0-9]/g, '_')
      const fileName = `Legal_Report_${sanitizedTitle}.pdf`

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Legal PDF report downloaded successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to download PDF report')
    } finally {
      setGeneratingReport(false)
    }
  }

  const triggerAnalyze = useCallback(async (docId) => {
    setAnalyzing(true)
    setError(null)
    try {
      const res = await documentsAPI.analyzeDocument(docId)
      setDocData(res.data.data)
      toast.success('AI Legal Analysis completed!')
    } catch (err) {
      console.error('Analysis error:', err.message)
      setError(err.message || 'Failed to generate AI analysis.')
    } finally {
      setAnalyzing(false)
      setLoading(false)
    }
  }, [])

  const fetchAnalysis = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (id) {
        const res = await documentsAPI.getAnalysis(id)
        if (res.data?.data?.analysisStatus === 'AI Completed') {
          setDocData(res.data.data)
        } else {
          // Trigger analysis if not yet performed or in progress
          triggerAnalyze(id)
          return
        }
      } else {
        setError('No document ID specified for AI analysis.')
      }
    } catch (err) {
      console.error('Fetch analysis error:', err.message)
      setError(err.message || 'Failed to load document analysis.')
    } finally {
      setLoading(false)
    }
  }, [id, triggerAnalyze])

  // Fetch document analysis on mount
  useEffect(() => {
    fetchAnalysis()
  }, [fetchAnalysis])

  const handleActionToggle = (idx) => {
    setCheckedActions((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const handleQuestionClick = (q) => {
    toast.success(`Question saved to quick queries: "${q}"`)
    navigate('/dashboard/chat', { state: { initialPrompt: q } })
  }

  const handleCopySummary = () => {
    const textToCopy = docData?.analysis?.summary || ''
    navigator.clipboard.writeText(textToCopy)
    toast.success('Summary copied to clipboard!')
  }

  // ─── Loading / Analyzing State ───────────────────────────────────────────────
  if (loading || analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center space-y-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-50)] text-[var(--color-primary)] ring-8 ring-[var(--color-primary-100)]"
        >
          <Bot size={40} />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[var(--color-text)]">
            Analyzing Legal Document with AI Agent...
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto">
            Extracting clauses, referencing Indian law acts (BNS, BNSS, BSA), evaluating risks, and translating legal jargon.
          </p>
        </div>

        {/* Shimmer Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[var(--color-border-light)] overflow-hidden">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-[var(--color-primary-light)] via-[var(--color-primary)] to-[var(--color-accent)] rounded-full"
          />
        </div>
      </div>
    )
  }

  // ─── Error State ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-xl mx-auto space-y-6 text-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-danger-50)] text-[var(--color-danger)] mx-auto">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Analysis Engine Error</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{error}</p>
        </div>
        <button onClick={() => triggerAnalyze(id)} className="btn-primary gap-2 mx-auto">
          <RotateCw size={16} /> Retry AI Analysis
        </button>
      </div>
    )
  }

  const analysis = docData?.analysis || {}

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* ── Top Bar ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard/documents')}
            className="btn-ghost text-xs gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-2 -ml-2"
          >
            <ArrowLeft size={14} /> Back to Documents
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
              {docData?.title || 'Legal Document Analysis'}
            </h1>
            <RiskBadge level={analysis.riskLevel} />
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="btn-primary text-xs gap-2 shadow-xs cursor-pointer disabled:opacity-60"
          >
            {generatingReport ? <Loader2 size={14} className="animate-spin" /> : <FileCheck2 size={14} />}
            <span>{generatingReport ? 'Generating PDF...' : 'Generate PDF Report'}</span>
          </button>

          <button
            onClick={() => triggerAnalyze(id)}
            className="btn-ghost text-xs gap-2 border border-[var(--color-border)]"
            id="reanalyze-btn"
          >
            <RotateCw size={14} /> Re-analyze
          </button>
        </div>
      </div>

      {/* ── Summary Card with Voice Read Aloud ───────────────────────────────────── */}
      <SectionCard>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--color-primary)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">
              Executive Summary
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <VoicePlayer text={analysis.summary} lang="en-IN" />
            <button
              onClick={handleCopySummary}
              className="btn-ghost p-1.5 text-xs gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              title="Copy summary"
            >
              <Copy size={14} /> Copy
            </button>
          </div>
        </div>
        <p className="text-sm text-[var(--color-text)] leading-relaxed bg-[var(--color-primary-50)] p-4 rounded-xl border border-[var(--color-primary-100)] font-medium">
          {analysis.summary}
        </p>
      </SectionCard>

      {/* ── AI Advocate Matcher Banner ────────────────────────────────────────── */}
      <RecommendationBanner documentId={id} />

      {/* ── Recommended Next Steps CTA ───────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-5 text-white shadow-lg border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
            <Users size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Recommended Next Steps</h4>
            <p className="text-xs text-indigo-200">
              Connect with top verified lawyers specializing in {analysis.documentType || 'this legal category'} near your location.
            </p>
          </div>
        </div>

        <Link
          to={`/dashboard/advocates/recommended/${id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-2.5 px-5 text-xs shadow-md transition-all shrink-0 hover:scale-[1.02]"
        >
          <span>Find Recommended Advocates</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* ── Simple Explanation with Voice Read Aloud ────────────────────────────── */}
      <SectionCard>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">
            Simple Plain-Language Explanation
          </h2>
          <VoicePlayer text={analysis.simpleExplanation} lang="en-IN" />
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-50)] text-[var(--color-accent-dark)] mt-0.5">
            <BookOpen size={18} />
          </div>
          <div className="space-y-3 flex-1">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {analysis.simpleExplanation}
            </p>

            {/* Key Points Bullet List */}
            {analysis.keyPoints?.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[var(--color-border-light)]">
                <p className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">
                  Key Clauses & Takeaways
                </p>
                <ul className="space-y-2">
                  {analysis.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shrink-0 mt-1.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── Phase 30: Emergency Warning Banner (if risk/urgent matter) ────── */}
      <EmergencyWarningBanner emergencyWarning={analysis.emergencyWarning} />

      {/* ── Phase 30: AI Legal Action Plan ("What Should You Do Next?") ──────── */}
      <ActionPlanTimeline actionPlan={analysis.actionPlan} />

      {/* ── Phase 30: Required Supporting Documents Checklist ────────────────── */}
      <RequiredDocumentsChecklist requiredDocuments={analysis.requiredDocuments} />

      {/* ── Phase 30: Evidence Preservation Checklist ────────────────────────── */}
      <EvidenceChecklist evidenceChecklist={analysis.evidenceChecklist} />

      {/* ── Phase 30: Authorities & Deadlines Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContactAuthoritiesCard contactAuthorities={analysis.contactAuthorities} />
        <DeadlineTimeline deadlines={analysis.deadlines} />
      </div>

      {/* ── Phase 30: Common Mistakes & Suggestions Grid ─────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MistakesCard mistakesToAvoid={analysis.mistakesToAvoid} />
        <SuggestionsCard helpfulSuggestions={analysis.helpfulSuggestions} />
      </div>

      {/* ── Phase 30: When Should You Hire a Lawyer? ──────────────────────────── */}
      <LawyerRecommendationCard
        lawyerRecommendation={analysis.lawyerRecommendation}
        recommendedAdvocateType={analysis.recommendedAdvocateType}
        documentId={id}
      />

      {/* ── Grid: Detected Laws + Important Dates ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Detected Laws Cards */}
        <SectionCard title="Detected Indian Laws & Sections">
          <div className="space-y-3">
            {analysis.detectedLaws?.map((law, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-3.5 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-alt)] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-[var(--color-primary-dark)]">
                    {law.act}
                  </p>
                  {law.section && (
                    <span className="badge badge-purple text-[10px]">{law.section}</span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {law.reason}
                </p>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Important Dates Timeline */}
        <SectionCard title="Important Dates & Timelines">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-primary-100)]">
            {analysis.importantDates?.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-primary-50)]" />
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)]">
                  <Calendar size={13} />
                  <span>{item.date}</span>
                </div>
                <p className="text-xs text-[var(--color-text)] mt-1 font-medium leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── Required Actions Checklist ────────────────────────────────────────── */}
      <SectionCard title="Recommended Actions Checklist">
        <div className="space-y-2.5">
          {analysis.requiredActions?.map((action, idx) => {
            const isChecked = !!checkedActions[idx]
            return (
              <label
                key={idx}
                onClick={() => handleActionToggle(idx)}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-[var(--color-accent-50)] border-[var(--color-accent-100)] opacity-75 line-through text-[var(--color-text-muted)]'
                    : 'bg-[var(--color-surface)] border-[var(--color-border-light)] hover:border-[var(--color-primary-100)] text-[var(--color-text)]'
                }`}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors mt-0.5 ${
                    isChecked
                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                      : 'border-[var(--color-border)] bg-white'
                  }`}
                >
                  {isChecked && <CheckCircle2 size={14} />}
                </div>
                <span className="text-xs font-medium leading-relaxed">{action}</span>
              </label>
            )
          })}
        </div>
      </SectionCard>

      {/* ── Suggested Questions ───────────────────────────────────────────────── */}
      <SectionCard title="Suggested Follow-up Questions for Lawyer or AI">
        <div className="flex flex-wrap gap-2.5">
          {analysis.questionsYouMayAsk?.map((q, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuestionClick(q)}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] px-3.5 py-2 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-100)] transition-colors text-left"
            >
              <HelpCircle size={14} className="shrink-0" />
              <span>{q}</span>
            </motion.button>
          ))}
        </div>
      </SectionCard>

      {/* ── Legal Disclaimer Banner ────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-2xl bg-[var(--color-warning-50)] p-4 border border-[var(--color-warning-100)]">
        <AlertCircle size={18} className="text-[var(--color-warning)] shrink-0 mt-0.5" />
        <p className="text-xs text-[#92400E] leading-relaxed">
          <strong className="font-semibold">Legal Disclaimer: </strong>
          {analysis.disclaimer}
        </p>
      </div>
    </div>
  )
}
