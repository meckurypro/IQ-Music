// src/pages/ServicesPage.jsx
import { AudioWaveform, Clapperboard, Sparkles, ArrowRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import { services } from '../components/servicesData'

const ICONS = { AudioWaveform, Clapperboard, Sparkles }

export default function ServicesPage() {
  return (
    <section style={{ paddingTop: 40 }}>
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Work with the label</span>
          <h2>What we offer.</h2>
          <p>Beyond our own artists, IQ Music produces for clients directly.</p>
        </Reveal>
        <div className="services-grid">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon]
            return (
              <Reveal as="div" className="service-card" key={s.tag} delay={i * 90}>
                <div className="service-card-top">
                  <span className="service-icon">{Icon && <Icon size={18} strokeWidth={1.75} />}</span>
                  <span className="service-tag">{s.tag}</span>
                </div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <a href="/contact" className="text-link" style={{ marginTop: 'auto' }}>
                  Get in touch <ArrowRight size={14} className="link-arrow" />
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
