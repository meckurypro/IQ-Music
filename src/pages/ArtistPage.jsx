// src/pages/ArtistPage.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ArtistPage() {
  const { id } = useParams()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from('music_artists')
      .select('*, music_artist_photos(*), music_artist_tracks(*)')
      .eq('id', id)
      .eq('is_published', true)
      .single()
      .then(({ data, error }) => {
        if (!active) return
        if (error) console.error('Failed to load artist:', error)
        setArtist(data || null)
        setLoading(false)
      })
    return () => { active = false }
  }, [id])

  if (loading) {
    return <section style={{ paddingTop: 80, textAlign: 'center' }}><p style={{ color: 'var(--muted)' }}>Loading…</p></section>
  }

  if (!artist) {
    return (
      <section style={{ paddingTop: 80, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Artist not found.</p>
        <Link to="/roster" className="text-link">Back to roster</Link>
      </section>
    )
  }

  const photos = (artist.music_artist_photos || []).sort((a, b) => a.sort_order - b.sort_order)
  const tracks = (artist.music_artist_tracks || []).sort((a, b) => a.sort_order - b.sort_order)
  const streamingLinks = artist.streaming_links || []
  const socialLinks = artist.social_links || []

  return (
    <section style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="artist-profile-header">
          {artist.profile_photo_url && (
            <img src={artist.profile_photo_url} alt={artist.stage_name} className="artist-profile-photo" />
          )}
          <div>
            <span className="eyebrow">{artist.genre || 'Artist'}</span>
            <h1 className="artist-profile-name">{artist.stage_name}</h1>
            {artist.name && artist.name !== artist.stage_name && (
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>{artist.name}</p>
            )}
          </div>
        </div>

        {artist.bio && (
          <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.75, maxWidth: 640, marginTop: 24 }}>
            {artist.bio}
          </p>
        )}

        {(artist.fanlink_url || streamingLinks.length > 0) && (
          <div style={{ marginTop: 28 }}>
            <h3 className="mini-heading">Listen</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
              {artist.fanlink_url && (
                <a href={artist.fanlink_url} target="_blank" rel="noreferrer" className="btn-primary">All platforms</a>
              )}
              {streamingLinks.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer" className="btn-outline">{s.platform}</a>
              ))}
            </div>
          </div>
        )}

        {tracks.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h3 className="mini-heading">Preview tracks</h3>
            <div style={{ display: 'grid', gap: 14, marginTop: 12, maxWidth: 520 }}>
              {tracks.map((t) => (
                <div key={t.id} className="track-row">
                  {t.thumbnail_url && <img src={t.thumbnail_url} alt={t.title} className="track-thumb" />}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{t.title}</p>
                    <audio controls src={t.audio_url} style={{ width: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h3 className="mini-heading">Photos</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginTop: 12 }}>
              {photos.map((p) => (
                <img key={p.id} src={p.url} alt={p.caption || artist.stage_name} className="artist-gallery-photo" />
              ))}
            </div>
          </div>
        )}

        {socialLinks.length > 0 && (
          <div style={{ marginTop: 40, marginBottom: 40 }}>
            <h3 className="mini-heading">Follow</h3>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 10 }}>
              {socialLinks.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-link">{s.platform}</a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
