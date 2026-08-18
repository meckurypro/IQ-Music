# IQ Music — PromptIQ

PromptIQ's record label site. Same Supabase project as promptiq-site /
iq-academy-site. Styling is a neutral placeholder — swap the color
tokens in `src/index.css` once the real IQ Music logo lands (same
approach as IQ Academy: colors get sampled from the real logo, not
guessed).

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

## Database setup

Run in order in the Supabase SQL editor:
1. `supabase/music_tables.sql` — creates `music_artists`,
   `music_artist_photos`, `music_artist_tracks`, and extends
   `promptiq_inquiries.service_interest` to accept `'music'`.
2. `supabase/music_storage.sql` — creates the `music-media` storage
   bucket (public read, staff/admin write).

## Routes

| Path | Purpose |
|---|---|
| `/` | Home — hero, roster teaser, "how it works", services teaser |
| `/roster` | Full artist grid |
| `/roster/:id` | Individual artist profile — bio, tracks, photos, links |
| `/services` | AI Music Production / Music Video / Artist Management |
| `/contact` | Collaboration or hire-a-service inquiries → `promptiq_inquiries` |
| `/staff` | Staff login (same login as Meckury AI / Academy — no signup) |
| `/staff/dashboard` | Protected — full artist CRUD, photo + audio uploads |

## Staff dashboard

Create, edit, publish/unpublish, and delete artists. Each artist can
have:
- Profile photo/thumbnail
- Bio, genre, fanlink URL
- Streaming links (repeatable platform/URL rows, used if no fanlink)
- Social links (repeatable platform/URL rows)
- Gallery photos (multiple, uploaded to Storage)
- Preview tracks (audio file + optional thumbnail + title, uploaded to Storage)

Deleting a photo, track, or artist also removes the underlying file(s)
from Storage.
