// src/components/MagneticButton.jsx
// Wraps a link/button and makes it "pull" slightly toward the cursor on
// hover — a small, premium-feeling micro-interaction used on primary CTAs.
import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({ as: Tag = 'a', className = '', children, strength = 14, ...rest }) {
  const ref = useRef(null)
  const MotionTag = motion[Tag] || motion.a

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.setProperty('--mx', `${(x / rect.width) * strength}px`)
    el.style.setProperty('--my', `${(y / rect.height) * strength}px`)
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '0px')
    el.style.setProperty('--my', '0px')
  }

  return (
    <MotionTag
      ref={ref}
      className={`magnetic-btn ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
