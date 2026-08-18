// src/pages/RosterPage.jsx
import { useEffect, useState } from 'react'
import Reveal from '../components/Reveal'
import ArtistCard from '../components/ArtistCard'
import { supabase } from '../lib/supabase'

export default function RosterPage() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from('music_artists')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (error) console.error('Failed to load roster:', error)
        setArtists(data || [])
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  return (
    <section style={{ paddingTop: 40 }}>
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">The roster</span>
          <h2>Our artists.</h2>
          <p>Each with their own sound, philosophy, and story.</p>
        </Reveal>

        {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}
        {!loading && artists.length === 0 && <p style={{ color: 'var(--muted)' }}>Roster coming soon.</p>}

        <div className="roster-grid">
          {artists.map((a, i) => (
            <Reveal as="div" key={a.id} delay={i * 60}>
              <ArtistCard artist={a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
