// src/components/Footer.jsx
import { Link } from 'react-router-dom'

const BRANDS = [
  { name: 'IQ Academy', href: 'https://academy.promptiq.com.ng', logo: '/iq-academy-logo.png' },
  { name: 'IQ Ads', href: 'https://ads.promptiq.com.ng', logo: '/iq-ads-logo.png' },
  { name: 'Meckury AI', href: 'https://meckury.ai', logo: null },
]

export default function Footer() {
  return (
    <footer>
      <div className="footer-backdrop">
        {BRANDS.map((b) => (
          <a key={b.name} href={b.href} target="_blank" rel="noopener noreferrer" className="footer-backdrop-item">
            {b.logo
              ? <img src={b.logo} alt={b.name} />
              : <span className="footer-backdrop-word">Meckury<span>.ai</span></span>}
          </a>
        ))}
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/roster" className="footer-link">Roster</Link>
          <Link to="/services" className="footer-link">Services</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>
          IQ Music — part of <a href="https://promptiq.com.ng" className="footer-brand-link">PromptIQ</a>. © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
