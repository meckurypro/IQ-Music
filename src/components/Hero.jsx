// src/components/Hero.jsx
import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'
import Marquee from './Marquee'

const TICKER = [
  'AI-NATIVE ARTISTS', 'HUMAN SONGWRITING', 'REAL ROYALTIES',
  'CINEMATIC MUSIC VIDEOS', 'AI ARTIST MANAGEMENT',
]

const headline = [
  { text: 'AI-native artists.', accent: false },
  { text: 'Human songwriting.', accent: true },
  { text: 'Real royalties.', accent: false },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const line = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  return (
    <header className="hero">
      {/* Layered ambient background: photo wash -> mesh gradient orbs -> grid -> grain */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-photo" />
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-grid" />
        <div className="hero-grain" />
      </div>

      <div className="container hero-inner">
        <motion.span
          className="eyebrow hero-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          PromptIQ's record label
        </motion.span>

        <motion.h1 variants={container} initial="hidden" animate="show">
          {headline.map((h, i) => (
            <motion.span className={`hero-line${h.accent ? ' accent' : ''}`} key={i} variants={line}>
              {h.text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="lede"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          IQ Music is where PromptIQ's digital characters become recording
          artists — distinct sounds, philosophies, and identities, written by
          real songwriters and produced with AI, reviewed and released under
          one label.
        </motion.p>

        <motion.div
          className="hero-btns"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <MagneticButton as="a" href="/roster" className="btn-primary">
            Meet the roster
          </MagneticButton>
          <MagneticButton as="a" href="/contact" className="btn-outline">
            Work with us
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        className="hero-ticker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <Marquee items={TICKER} speed={26} />
      </motion.div>

      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <span className="scroll-cue-line" />
        <span className="scroll-cue-label">Scroll</span>
      </motion.div>
    </header>
  )
}
