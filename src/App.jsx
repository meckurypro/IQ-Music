// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedStaffRoute from './components/ProtectedStaffRoute'
import Home from './pages/Home'
import RosterPage from './pages/RosterPage'
import ArtistPage from './pages/ArtistPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import WorkWithUsPage from './pages/WorkWithUsPage'
import StaffLogin from './pages/staff/StaffLogin'
import StaffDashboard from './pages/staff/StaffDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roster" element={<RosterPage />} />
          <Route path="/roster/:id" element={<ArtistPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/work-with-us" element={<WorkWithUsPage />} />
          <Route path="/staff" element={<StaffLogin />} />
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedStaffRoute>
                <StaffDashboard />
              </ProtectedStaffRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
