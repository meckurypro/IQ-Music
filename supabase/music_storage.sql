-- supabase/music_storage.sql
-- Storage bucket for IQ Music artist media: profile photos, gallery
-- photos, track thumbnails, and audio files. Run after music_tables.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'music-media',
  'music-media',
  true,
  104857600, -- 100MB per file (audio files run larger than images)
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-m4a']
)
on conflict (id) do nothing;

create policy "Public can view music media"
  on storage.objects for select
  using (bucket_id = 'music-media');

create policy "Staff can upload music media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'music-media'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.is_staff = true or profiles.role = 'admin')
    )
  );

create policy "Staff can update music media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'music-media'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.is_staff = true or profiles.role = 'admin')
    )
  )
  with check (
    bucket_id = 'music-media'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.is_staff = true or profiles.role = 'admin')
    )
  );

create policy "Staff can delete music media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'music-media'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.is_staff = true or profiles.role = 'admin')
    )
  );
