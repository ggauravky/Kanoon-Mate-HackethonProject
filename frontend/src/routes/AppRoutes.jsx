import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../pages/HomePage'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
