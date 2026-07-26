import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdvocateSidebar from './AdvocateSidebar'
import AdvocateNavbar from './AdvocateNavbar'

export default function AdvocateLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Dedicated Advocate Sidebar */}
      <AdvocateSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Right Content Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Advocate Navbar */}
        <AdvocateNavbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
