// src/components/ArtistCard.jsx
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function ArtistCard({ artist }) {
  return (
    <Link to={`/roster/${artist.id}`} className="artist-card">
      <div className="artist-card-photo">
        {artist.profile_photo_url ? (
          <img src={artist.profile_photo_url} alt={artist.stage_name} />
        ) : (
          <div className="artist-card-photo-placeholder" />
        )}
        <span className="artist-card-hint">
          <ArrowUpRight size={16} strokeWidth={2} />
        </span>
      </div>
      <div className="artist-card-info">
        <strong>{artist.stage_name}</strong>
        {artist.genre && <span>{artist.genre}</span>}
      </div>
    </Link>
  )
}
