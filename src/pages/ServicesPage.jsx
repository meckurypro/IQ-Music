// src/pages/ServicesPage.jsx
import Reveal from '../components/Reveal'
import { services } from '../components/servicesData'

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
          {services.map((s, i) => (
            <Reveal as="div" className="service-card" key={s.tag} delay={i * 80}>
              <span className="service-tag">{s.tag}</span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <a href="/contact" className="text-link" style={{ marginTop: 'auto' }}>Get in touch →</a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
