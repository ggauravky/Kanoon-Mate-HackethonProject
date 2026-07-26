import { FileText, Image as ImageIcon, X, HardDrive } from 'lucide-react'

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default function FilePreview({ file, onRemove, disabled }) {
  if (!file) return null

  const isPDF = file.type === 'application/pdf'

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${
          isPDF ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {isPDF ? <FileText size={22} /> : <ImageIcon size={22} />}
        </div>
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {file.name}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
            <span className="flex items-center gap-1 font-mono">
              <HardDrive size={11} /> {formatBytes(file.size)}
            </span>
            <span>•</span>
            <span className="uppercase font-semibold text-slate-600">{file.type.split('/')[1]}</span>
          </div>
        </div>
      </div>

      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="Remove File"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}
