// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
}

function Page({ children }) {
  return (
    <motion.div className="page-shell" {...pageTransition}>
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/roster" element={<Page><RosterPage /></Page>} />
        <Route path="/roster/:id" element={<Page><ArtistPage /></Page>} />
        <Route path="/services" element={<Page><ServicesPage /></Page>} />
        <Route path="/contact" element={<Page><ContactPage /></Page>} />
        <Route path="/work-with-us" element={<Page><WorkWithUsPage /></Page>} />
        <Route path="/staff" element={<Page><StaffLogin /></Page>} />
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedStaffRoute>
              <Page><StaffDashboard /></Page>
            </ProtectedStaffRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
