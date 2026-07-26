import { Outlet, Link } from 'react-router-dom'
import { Scale } from 'lucide-react'
import { APP_NAME } from '../../constants/app'

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-slate-900">
            <Scale className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            <span className="text-lg font-semibold">{APP_NAME}</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} {APP_NAME}. Phase 1 foundation.
      </footer>
    </div>
  )
}

export default AppLayout
