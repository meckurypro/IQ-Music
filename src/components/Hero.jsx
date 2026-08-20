// src/components/Hero.jsx
import { useRef } from 'react'
import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'
import Marquee from './Marquee'

const TICKER = [
  'ORIGINAL COMPOSITIONS', 'HUMAN-WRITTEN LYRICS', 'AI PRODUCTION',
  'CINEMATIC VISUALS', 'ARTIST MANAGEMENT', 'REAL ROYALTIES',
]

const headline = [
  { text: 'Real songs.', accent: false },
  { text: 'Unreal artists.', accent: true },
  { text: 'Same royalties.', accent: false },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const line = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}

const WAVE_HEIGHTS = [40, 90, 60, 130, 75, 160, 55, 100, 45, 120, 70, 150, 50, 95, 65]

export default function Hero() {
  const glowRef = useRef(null)

  const handleMouseMove = (e) => {
    const el = glowRef.current
    if (!el) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--cx', `${x}%`)
    el.style.setProperty('--cy', `${y}%`)
    el.style.setProperty('--glow-opacity', '1')
  }
  const handleMouseLeave = () => {
    glowRef.current?.style.setProperty('--glow-opacity', '0')
  }

  return (
    <header className="hero" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-mesh" />
        <div className="hero-cursor-glow" ref={glowRef} />
        <div className="hero-grid" />
        <div className="hero-grain" />
        <div className="hero-wave">
          {WAVE_HEIGHTS.map((h, i) => (
            <span key={i} style={{ '--wave-h': `${h}px`, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>

      <div className="container hero-inner">
        <motion.span
          className="eyebrow hero-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          A PromptIQ label
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
          Every IQ Music artist is written by a real songwriter, produced
          with AI, and reviewed before release — a full identity, a
          catalogue, and royalties that pay out like any other label.
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
        <Marquee items={TICKER} speed={30} />
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
