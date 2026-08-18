// src/components/Hero.jsx
export default function Hero() {
  return (
    <header className="hero">
      <div className="container hero-inner">
        <span className="eyebrow">PromptIQ's record label</span>
        <h1>
          AI-native artists.<br />
          <span className="accent">Human songwriting.</span> Real royalties.
        </h1>
        <p className="lede">
          IQ Music is where PromptIQ's digital characters become recording
          artists — distinct sounds, philosophies, and identities, written by
          real songwriters and produced with AI, reviewed and released under
          one label.
        </p>
        <div className="hero-btns">
          <a href="/roster" className="btn-primary">Meet the roster</a>
          <a href="/contact" className="btn-outline">Work with us</a>
        </div>
      </div>
    </header>
  )
}
