// src/components/ServicesTeaser.jsx
import Reveal from './Reveal'
import { services } from './servicesData'

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
          {services.map((s, i) => (
            <Reveal as="div" className="service-card" key={s.tag} delay={i * 80}>
              <span className="service-tag">{s.tag}</span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <a href="/services" className="text-link">See all services →</a>
        </Reveal>
      </div>
    </section>
  )
}
