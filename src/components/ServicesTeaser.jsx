// src/components/ServicesTeaser.jsx
import { AudioWaveform, Clapperboard, Sparkles, ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import { services } from './servicesData'

const ICONS = { AudioWaveform, Clapperboard, Sparkles }

export default function ServicesTeaser() {
  return (
    <section id="services-teaser">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Also available to hire</span>
          <h2>Not just our own artists.</h2>
          <p>IQ Music produces for clients too — music, video, and artist management, on the same infrastructure.</p>
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
              </Reveal>
            )
          })}
        </div>
        <Reveal delay={200}>
          <a href="/services" className="text-link">
            See all services <ArrowRight size={14} className="link-arrow" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
