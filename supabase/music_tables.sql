-- supabase/music_tables.sql
-- IQ Music artist roster tables. Run in the Supabase SQL editor
-- (same project as Meckury AI / PromptIQ / IQ Academy).

create table if not exists public.music_artists (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,               -- the character's real/full name
  stage_name text not null,         -- performing name
  genre text,
  bio text,                         -- personality, philosophy, sound, fashion, message
  profile_photo_url text,           -- thumbnail / profile photo
  fanlink_url text,                 -- single aggregator link, optional
  social_links jsonb not null default '[]',     -- [{platform, url}, ...]
  streaming_links jsonb not null default '[]',  -- [{platform, url}, ...] fallback if no fanlink
  is_published boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.music_artist_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  artist_id uuid not null references public.music_artists(id) on delete cascade,
  url text not null,
  caption text,
  sort_order int not null default 0
);

create table if not exists public.music_artist_tracks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  artist_id uuid not null references public.music_artists(id) on delete cascade,
  title text not null,
  audio_url text not null,
  thumbnail_url text,
  sort_order int not null default 0
);

-- Enable RLS
alter table public.music_artists enable row level security;
alter table public.music_artist_photos enable row level security;
alter table public.music_artist_tracks enable row level security;

-- Public can view published artists (and all their photos/tracks)
create policy "Public can view published artists"
  on public.music_artists for select
  using (is_published = true);

create policy "Public can view artist photos"
  on public.music_artist_photos for select
  using (
    exists (
      select 1 from public.music_artists
      where music_artists.id = music_artist_photos.artist_id
      and music_artists.is_published = true
    )
  );

create policy "Public can view artist tracks"
  on public.music_artist_tracks for select
  using (
    exists (
      select 1 from public.music_artists
      where music_artists.id = music_artist_tracks.artist_id
      and music_artists.is_published = true
    )
  );

-- Staff/admin full access (same is_staff/role check used across PromptIQ sites)
create policy "Staff can manage artists"
  on public.music_artists for all
  to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and (profiles.is_staff = true or profiles.role = 'admin')))
  with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and (profiles.is_staff = true or profiles.role = 'admin')));

create policy "Staff can manage artist photos"
  on public.music_artist_photos for all
  to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and (profiles.is_staff = true or profiles.role = 'admin')))
  with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and (profiles.is_staff = true or profiles.role = 'admin')));

create policy "Staff can manage artist tracks"
  on public.music_artist_tracks for all
  to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and (profiles.is_staff = true or profiles.role = 'admin')))
  with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and (profiles.is_staff = true or profiles.role = 'admin')));

-- Note: staff also need to SELECT unpublished/draft artists while editing
-- in the dashboard. Add this if you want drafts visible to staff before
-- publishing (the "manage" policy above already covers this via `for all`,
-- so no extra policy is required — `for all` includes select).

create index if not exists music_artists_published_idx on public.music_artists (is_published, sort_order);
create index if not exists music_artist_photos_artist_idx on public.music_artist_photos (artist_id, sort_order);
create index if not exists music_artist_tracks_artist_idx on public.music_artist_tracks (artist_id, sort_order);

-- ─────────────────────────────────────────────────────────────
-- Extend the shared promptiq_inquiries table to accept 'music'
-- as a service_interest value, so IQ Music's contact form can
-- route into the same inquiries table as the rest of PromptIQ.
-- ─────────────────────────────────────────────────────────────
alter table public.promptiq_inquiries drop constraint if exists promptiq_inquiries_service_interest_check;
alter table public.promptiq_inquiries add constraint promptiq_inquiries_service_interest_check
  check (service_interest = any (array['cinema','ads','academy','meckury_ai','music','other']));
