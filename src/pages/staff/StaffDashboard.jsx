// src/pages/staff/StaffDashboard.jsx
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const inputStyle = {
  width: '100%', background: 'var(--surface)', border: '1px solid var(--line)',
  color: 'var(--text)', padding: '10px 12px', borderRadius: 6, fontSize: 14,
}
const labelStyle = { fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 5 }
const cardStyle = { padding: '16px 18px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10 }

function Field({ label, children }) {
  return <div><label style={labelStyle}>{label}</label>{children}</div>
}

const emptyArtistForm = {
  name: '', stage_name: '', genre: '', bio: '', fanlink_url: '', is_published: true,
}
const emptyLinkRow = { platform: '', url: '' }

// ── shared upload helpers ─────────────────────────────────
async function uploadFile(file, folder) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${folder}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage.from('music-media').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('music-media').getPublicUrl(path)
  return data.publicUrl
}

function extractStoragePath(url) {
  const marker = '/music-media/'
  const idx = url.indexOf(marker)
  return idx !== -1 ? url.slice(idx + marker.length) : null
}

// ── Link rows editor (used for social_links and streaming_links) ──
function LinkRowsEditor({ label, rows, onChange, placeholder }) {
  const update = (i, field, value) => {
    const next = [...rows]
    next[i] = { ...next[i], [field]: value }
    onChange(next)
  }
  const add = () => onChange([...rows, { ...emptyLinkRow }])
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i))

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'grid', gap: 8 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <input style={{ ...inputStyle, maxWidth: 140 }} placeholder={placeholder || 'Platform'} value={row.platform} onChange={(e) => update(i, 'platform', e.target.value)} />
            <input style={inputStyle} placeholder="URL" value={row.url} onChange={(e) => update(i, 'url', e.target.value)} />
            <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#e0776a', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, cursor: 'pointer', padding: 0 }}>
        + Add link
      </button>
    </div>
  )
}

// ── Artist form (shared by create + edit) ─────────────────
function ArtistForm({ initial, onSubmit, submitLabel, onCancel }) {
  const [form, setForm] = useState(initial.form)
  const [socialLinks, setSocialLinks] = useState(initial.social_links)
  const [streamingLinks, setStreamingLinks] = useState(initial.streaming_links)
  const [photoFile, setPhotoFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit({
        form,
        socialLinks: socialLinks.filter((r) => r.platform && r.url),
        streamingLinks: streamingLinks.filter((r) => r.platform && r.url),
        photoFile,
      })
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Name (character's real name)">
          <input style={inputStyle} required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        </Field>
        <Field label="Stage name">
          <input style={inputStyle} required value={form.stage_name} onChange={(e) => setForm((p) => ({ ...p, stage_name: e.target.value }))} />
        </Field>
      </div>
      <Field label="Genre"><input style={inputStyle} value={form.genre} onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))} /></Field>
      <Field label="Bio (personality, philosophy, sound, fashion, message)">
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
      </Field>
      <Field label="Profile photo / thumbnail">
        <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0] || null)} style={{ fontSize: 13, color: 'var(--text-dim)' }} />
      </Field>
      <Field label="Fanlink URL (optional — shown first if set)">
        <input style={inputStyle} placeholder="https://..." value={form.fanlink_url} onChange={(e) => setForm((p) => ({ ...p, fanlink_url: e.target.value }))} />
      </Field>
      <LinkRowsEditor label="Streaming links (used if no fanlink)" rows={streamingLinks} onChange={setStreamingLinks} placeholder="Spotify" />
      <LinkRowsEditor label="Social links" rows={socialLinks} onChange={setSocialLinks} placeholder="Instagram" />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-dim)' }}>
        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} />
        Published (visible on site)
      </label>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="btn-primary" disabled={saving} style={{ width: 'fit-content' }}>
          {saving ? 'Saving…' : submitLabel}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="btn-outline" style={{ width: 'fit-content' }}>Cancel</button>}
      </div>
    </form>
  )
}

// ── Media manager (photos + tracks) for one artist ─────────
function ArtistMediaManager({ artist, onChanged }) {
  const [photoUploading, setPhotoUploading] = useState(false)
  const [trackForm, setTrackForm] = useState({ title: '', audioFile: null, thumbFile: null })
  const [trackUploading, setTrackUploading] = useState(false)
  const photoInputRef = useRef(null)

  const photos = (artist.music_artist_photos || []).sort((a, b) => a.sort_order - b.sort_order)
  const tracks = (artist.music_artist_tracks || []).sort((a, b) => a.sort_order - b.sort_order)

  const handleAddPhotos = async (files) => {
    if (!files || files.length === 0) return
    setPhotoUploading(true)
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, `artists/${artist.id}/photos`)
        const { error } = await supabase.from('music_artist_photos').insert([{ artist_id: artist.id, url, caption: file.name }])
        if (error) throw error
      }
      onChanged()
    } catch (err) {
      alert('Upload failed: ' + err.message)
    }
    setPhotoUploading(false)
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const handleDeletePhoto = async (photo) => {
    if (!confirm('Delete this photo?')) return
    const { error } = await supabase.from('music_artist_photos').delete().eq('id', photo.id)
    if (error) { alert(error.message); return }
    const path = extractStoragePath(photo.url)
    if (path) await supabase.storage.from('music-media').remove([path])
    onChanged()
  }

  const handleAddTrack = async (e) => {
    e.preventDefault()
    if (!trackForm.audioFile) { alert('Choose an audio file.'); return }
    setTrackUploading(true)
    try {
      const audioUrl = await uploadFile(trackForm.audioFile, `artists/${artist.id}/tracks`)
      const thumbUrl = trackForm.thumbFile ? await uploadFile(trackForm.thumbFile, `artists/${artist.id}/tracks`) : null
      const { error } = await supabase.from('music_artist_tracks').insert([{
        artist_id: artist.id, title: trackForm.title || trackForm.audioFile.name, audio_url: audioUrl, thumbnail_url: thumbUrl,
      }])
      if (error) throw error
      setTrackForm({ title: '', audioFile: null, thumbFile: null })
      onChanged()
    } catch (err) {
      alert('Upload failed: ' + err.message)
    }
    setTrackUploading(false)
  }

  const handleDeleteTrack = async (track) => {
    if (!confirm('Delete this track?')) return
    const { error } = await supabase.from('music_artist_tracks').delete().eq('id', track.id)
    if (error) { alert(error.message); return }
    const audioPath = extractStoragePath(track.audio_url)
    if (audioPath) await supabase.storage.from('music-media').remove([audioPath])
    if (track.thumbnail_url) {
      const thumbPath = extractStoragePath(track.thumbnail_url)
      if (thumbPath) await supabase.storage.from('music-media').remove([thumbPath])
    }
    onChanged()
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Photos</p>
        {photos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8, marginBottom: 10 }}>
            {photos.map((p) => (
              <div key={p.id} style={{ position: 'relative' }}>
                <img src={p.url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6, border: '1px solid var(--line)' }} />
                <button onClick={() => handleDeletePhoto(p)} style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', fontSize: 11, cursor: 'pointer' }}>×</button>
              </div>
            ))}
          </div>
        )}
        <input ref={photoInputRef} type="file" accept="image/*" multiple disabled={photoUploading} onChange={(e) => handleAddPhotos(e.target.files)} style={{ fontSize: 13, color: 'var(--text-dim)' }} />
        {photoUploading && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Uploading…</p>}
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Preview tracks</p>
        {tracks.length > 0 && (
          <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
            {tracks.map((t) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 8 }}>
                <span style={{ fontSize: 13 }}>{t.title}</span>
                <button onClick={() => handleDeleteTrack(t)} style={{ background: 'none', border: 'none', color: '#e0776a', fontSize: 12, cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleAddTrack} style={{ display: 'grid', gap: 8, maxWidth: 380 }}>
          <input style={inputStyle} placeholder="Track title" value={trackForm.title} onChange={(e) => setTrackForm((p) => ({ ...p, title: e.target.value }))} />
          <Field label="Audio file"><input type="file" accept="audio/*" onChange={(e) => setTrackForm((p) => ({ ...p, audioFile: e.target.files[0] || null }))} style={{ fontSize: 13, color: 'var(--text-dim)' }} /></Field>
          <Field label="Track thumbnail (optional)"><input type="file" accept="image/*" onChange={(e) => setTrackForm((p) => ({ ...p, thumbFile: e.target.files[0] || null }))} style={{ fontSize: 13, color: 'var(--text-dim)' }} /></Field>
          <button type="submit" className="btn-outline" disabled={trackUploading} style={{ width: 'fit-content' }}>
            {trackUploading ? 'Uploading…' : 'Add track'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Artists tab ─────────────────────────────────────────────
function ArtistsTab() {
  const [artists, setArtists] = useState([])
  const [creating, setCreating] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const load = () => {
    supabase
      .from('music_artists')
      .select('*, music_artist_photos(*), music_artist_tracks(*)')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => { if (error) console.error(error); setArtists(data || []) })
  }
  useEffect(load, [])

  const handleCreate = async ({ form, socialLinks, streamingLinks, photoFile }) => {
    let profilePhotoUrl = null
    if (photoFile) profilePhotoUrl = await uploadFile(photoFile, 'artists/profile')
    const { error } = await supabase.from('music_artists').insert([{
      ...form, social_links: socialLinks, streaming_links: streamingLinks, profile_photo_url: profilePhotoUrl,
    }])
    if (error) throw error
    setCreating(false)
    load()
  }

  const handleUpdate = async (artist, { form, socialLinks, streamingLinks, photoFile }) => {
    let profilePhotoUrl = artist.profile_photo_url
    if (photoFile) profilePhotoUrl = await uploadFile(photoFile, 'artists/profile')
    const { error } = await supabase.from('music_artists').update({
      ...form, social_links: socialLinks, streaming_links: streamingLinks, profile_photo_url: profilePhotoUrl,
    }).eq('id', artist.id)
    if (error) throw error
    setEditingId(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this artist? Their photos and tracks will be removed too.')) return
    const { error } = await supabase.from('music_artists').delete().eq('id', id)
    if (error) { alert(error.message); return }
    load()
  }

  return (
    <div>
      {!creating && (
        <button onClick={() => setCreating(true)} className="btn-primary" style={{ marginBottom: 24, width: 'fit-content' }}>
          + Add artist
        </button>
      )}
      {creating && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 14 }}>New artist</h3>
          <ArtistForm
            initial={{ form: emptyArtistForm, social_links: [], streaming_links: [] }}
            onSubmit={handleCreate}
            submitLabel="Create artist"
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {artists.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 13 }}>No artists yet.</p>}
        {artists.map((a) => (
          <div key={a.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {a.profile_photo_url && <img src={a.profile_photo_url} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />}
                <div>
                  <strong style={{ fontSize: 14 }}>{a.stage_name}</strong>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>
                    {a.genre || 'No genre set'} · {a.is_published ? 'Published' : 'Draft'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
                <button onClick={() => { setEditingId(editingId === a.id ? null : a.id); setExpandedId(null) }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, cursor: 'pointer' }}>
                  {editingId === a.id ? 'Close' : 'Edit'}
                </button>
                <button onClick={() => { setExpandedId(expandedId === a.id ? null : a.id); setEditingId(null) }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, cursor: 'pointer' }}>
                  {expandedId === a.id ? 'Hide media' : 'Manage media'}
                </button>
                <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', color: '#e0776a', fontSize: 13, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>

            {editingId === a.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                <ArtistForm
                  initial={{
                    form: { name: a.name, stage_name: a.stage_name, genre: a.genre || '', bio: a.bio || '', fanlink_url: a.fanlink_url || '', is_published: a.is_published },
                    social_links: a.social_links && a.social_links.length ? a.social_links : [],
                    streaming_links: a.streaming_links && a.streaming_links.length ? a.streaming_links : [],
                  }}
                  onSubmit={(payload) => handleUpdate(a, payload)}
                  submitLabel="Save changes"
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )}

            {expandedId === a.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                <ArtistMediaManager artist={a} onChanged={load} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Dashboard shell ──────────────────────────────────────────
export default function StaffDashboard() {
  const { profile, signOut } = useAuth()

  return (
    <section style={{ paddingTop: 40 }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <span className="eyebrow">Staff</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, margin: '10px 0' }}>Manage IQ Music</h2>
          </div>
          <button onClick={signOut} className="btn-outline">Sign out</button>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 28 }}>
          Signed in as {profile?.username || profile?.display_name || 'staff'}
        </p>
        <ArtistsTab />
      </div>
    </section>
  )
}
