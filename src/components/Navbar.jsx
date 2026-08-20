// src/components/Navbar.jsx
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'

const LINKS = [
  { to: '/roster', label: 'Roster' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="nav-links">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className="nav-link">
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-right">
          <Link to="/work-with-us" className="nav-cta">
            <span>Work with us</span>
          </Link>
          <button
            className={`hamburger${open ? ' is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-drawer is-open"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="mobile-links" onClick={() => setOpen(false)}>
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
              ))}
              <NavLink to="/work-with-us" onClick={() => setOpen(false)}>Work with us</NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
