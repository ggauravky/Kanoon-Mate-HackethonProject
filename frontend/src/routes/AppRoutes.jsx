import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import AdminLayout from '../components/layout/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'

// Citizen Dashboard Pages
import DashboardHome from '../pages/dashboard/DashboardHome'
import Documents from '../pages/dashboard/Documents'
import Upload from '../pages/dashboard/Upload'
import DocumentDetailsPage from '../pages/dashboard/DocumentDetailsPage'
import DocumentAnalysis from '../pages/dashboard/DocumentAnalysis'
import History from '../pages/dashboard/History'
import Deadlines from '../pages/dashboard/Deadlines'
import Reports from '../pages/dashboard/Reports'
import LegalHelp from '../pages/dashboard/LegalHelp'
import ServiceDetails from '../pages/dashboard/ServiceDetails'
import Favorites from '../pages/dashboard/Favorites'
import Notifications from '../pages/dashboard/Notifications'
import AIChat from '../pages/dashboard/AIChat'
import Profile from '../pages/dashboard/Profile'
import Settings from '../pages/dashboard/Settings'

// Admin Console Pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import Users from '../pages/admin/Users'
import AdminDocuments from '../pages/admin/AdminDocuments'
import AdminReports from '../pages/admin/AdminReports'
import AdminLegalServices from '../pages/admin/AdminLegalServices'
import AdminNotifications from '../pages/admin/AdminNotifications'
import AdminAnalytics from '../pages/admin/AdminAnalytics'
import AdminSettings from '../pages/admin/AdminSettings'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Landing Page ────────────────────────────────────── */}
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* ── Protected Citizen Dashboard Routes ────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="documents" element={<Documents />} />
            <Route path="upload" element={<Upload />} />
            <Route path="analysis/:id" element={<DocumentAnalysis />} />
            <Route path="reports" element={<Reports />} />
            <Route path="legal-help" element={<LegalHelp />} />
            <Route path="legal-help/:id" element={<ServiceDetails />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="deadlines" element={<Deadlines />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Single Document View */}
          <Route path="/document/:id" element={<DashboardLayout />}>
            <Route index element={<DocumentDetailsPage />} />
          </Route>
        </Route>

        {/* ── Protected Admin Console Routes (RBAC Protected) ────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="legal-services" element={<AdminLegalServices />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
