// src/pages/Home.jsx
import Hero from '../components/Hero'
import RosterTeaser from '../components/RosterTeaser'
import ServicesTeaser from '../components/ServicesTeaser'
import Reveal from '../components/Reveal'

const STEPS = [
  {
    title: 'A songwriter writes it',
    body: 'Every track starts as a real song, written by a real person — lyrics, melody, and intent, before any production begins.',
  },
  {
    title: 'AI produces it',
    body: 'Meckury oversees production — voice, instrumentation, and mix — built on the same pipeline behind IQ Cinema.',
  },
  {
    title: 'The label releases it',
    body: 'Reviewed, approved, and released under one roof. Songwriters keep their credit and their royalties, same as any label.',
  },
]

export default function Home() {
  return (
    <>
      <Hero />
      <RosterTeaser />
      <section id="philosophy">
        <div className="container">
          <Reveal className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">How it works</span>
            <h2>AI produces. People write.</h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="process-grid">
              {STEPS.map((s, i) => (
                <div className="process-step" key={s.title}>
                  <span className="process-num">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <ServicesTeaser />
    </>
  )
}
