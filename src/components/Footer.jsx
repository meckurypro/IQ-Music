// src/components/Footer.jsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/roster" className="footer-link">Roster</Link>
          <Link to="/services" className="footer-link">Services</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>
          IQ Music — part of <a href="https://promptiq.ng" className="footer-brand-link">PromptIQ</a>. © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
