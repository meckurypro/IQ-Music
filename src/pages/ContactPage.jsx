// src/pages/ContactPage.jsx
const PHONE_DISPLAY = '+234 816 246 5247'
const PHONE_WA = '2348162465247'
const EMAIL = 'promptiq2026@gmail.com'

const SIBLINGS = [
  {
    name: 'IQ Academy',
    tag: 'Learn AI skills',
    href: 'https://academy.promptiq.com.ng',
    logo: '/iq-academy-logo.png',
  },
  {
    name: 'IQ Ads',
    tag: 'Cinematic commercials',
    href: 'https://ads.promptiq.com.ng',
    logo: '/iq-ads-logo.png',
  },
  {
    name: 'Meckury AI',
    tag: 'Content creation & filmmaking',
    href: 'https://meckury.ai',
    logo: null,
  },
]

export default function ContactPage() {
  return (
    <section style={{ paddingTop: 40 }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <span className="eyebrow">Get in touch</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, margin: '14px 0 28px' }}>
          Talk to IQ Music.
        </h2>

        <div style={{ display: 'grid', gap: 0, marginBottom: 40 }}>
          <a
            href={`https://wa.me/${PHONE_WA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <span className="contact-icon">📞</span>
            <span className="contact-card-body">
              <span className="contact-label">Phone / WhatsApp</span>
              <span className="contact-value">{PHONE_DISPLAY}</span>
            </span>
          </a>

          <a href={`mailto:${EMAIL}`} className="contact-card">
            <span className="contact-icon">✉️</span>
            <span className="contact-card-body">
              <span className="contact-label">Email</span>
              <span className="contact-value">{EMAIL}</span>
            </span>
          </a>
        </div>

        <span className="mini-heading" style={{ display: 'block', marginBottom: 14 }}>
          More from PromptIQ
        </span>
        <div className="sibling-grid">
          {SIBLINGS.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="sibling-card">
              {s.logo
                ? <img src={s.logo} alt={s.name} />
                : <span className="sibling-card-word">Meckury<span>.ai</span></span>}
              <div>
                <strong>{s.name}</strong>
                <p>{s.tag}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
