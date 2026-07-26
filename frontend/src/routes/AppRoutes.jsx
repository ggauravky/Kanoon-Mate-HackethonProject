import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'
import DashboardHome from '../pages/dashboard/DashboardHome'
import Documents from '../pages/dashboard/Documents'
import Upload from '../pages/dashboard/Upload'
import DocumentDetailsPage from '../pages/dashboard/DocumentDetailsPage'
import DocumentAnalysis from '../pages/dashboard/DocumentAnalysis'
import History from '../pages/dashboard/History'
import Deadlines from '../pages/dashboard/Deadlines'
import AIChat from '../pages/dashboard/AIChat'
import Profile from '../pages/dashboard/Profile'
import Settings from '../pages/dashboard/Settings'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Routes ─────────────────────────────────────────── */}
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* ── Protected Dashboard Routes ────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="documents" element={<Documents />} />
            <Route path="upload" element={<Upload />} />
            <Route path="analysis/:id" element={<DocumentAnalysis />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="deadlines" element={<Deadlines />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Document Details View Route */}
          <Route path="/document/:id" element={<DashboardLayout />}>
            <Route index element={<DocumentDetailsPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
