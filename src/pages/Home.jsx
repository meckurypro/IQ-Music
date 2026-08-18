// src/pages/Home.jsx
import Hero from '../components/Hero'
import RosterTeaser from '../components/RosterTeaser'
import ServicesTeaser from '../components/ServicesTeaser'
import Reveal from '../components/Reveal'

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
            <p>
              Every IQ Music artist has a real songwriter behind the lyrics.
              Meckury oversees lyric quality and AI production, the team
              reviews and approves each release before it goes out, and
              songwriters earn ongoing streaming and mechanical royalties —
              same as any other label.
            </p>
          </Reveal>
        </div>
      </section>
      <ServicesTeaser />
    </>
  )
}
