// src/components/RosterTeaser.jsx
import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import ArtistCard from './ArtistCard'
import { supabase } from '../lib/supabase'

export default function RosterTeaser() {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    let active = true
    supabase
      .from('music_artists')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(4)
      .then(({ data, error }) => {
        if (!active) return
        if (error) { console.error('Failed to load roster:', error); return }
        setArtists(data || [])
      })
    return () => { active = false }
  }, [])

  if (artists.length === 0) return null

  return (
    <section id="roster-teaser">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">The roster</span>
          <h2>Meet the label.</h2>
        </Reveal>
        <div className="roster-grid">
          {artists.map((a, i) => (
            <Reveal as="div" key={a.id} delay={i * 70}>
              <ArtistCard artist={a} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={150}>
          <a href="/roster" className="text-link">See the full roster →</a>
        </Reveal>
      </div>
    </section>
  )
}
