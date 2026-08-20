// src/components/Marquee.jsx
// Infinite horizontal scroll ticker. Duplicates children once so the
// CSS animation can loop seamlessly from -50% back to 0.
export default function Marquee({ items, speed = 28 }) {
  return (
    <div className="marquee" style={{ '--marquee-duration': `${speed}s` }}>
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
            <span className="marquee-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
