-- ==================================================
-- SUPABASE STORAGE BUCKETS & POLICIES
-- ==================================================

-- 1. Create Buckets
-- Run this in Supabase Storage SQL or dashboard if not automatically created:
-- insert into storage.buckets (id, name, public) values 
-- ('news', 'news', true),
-- ('gallery', 'gallery', true),
-- ('umkm', 'umkm', true),
-- ('officials', 'officials', true),
-- ('complaints', 'complaints', false);

-- 2. News Bucket Policies (Public Read, Authenticated CRUD)
create policy "Public Read News Images"
on storage.objects for select
using (bucket_id = 'news');

create policy "Authenticated Insert News Images"
on storage.objects for insert
with check (bucket_id = 'news' and auth.role() = 'authenticated');

create policy "Authenticated Update News Images"
on storage.objects for update
using (bucket_id = 'news' and auth.role() = 'authenticated');

create policy "Authenticated Delete News Images"
on storage.objects for delete
using (bucket_id = 'news' and auth.role() = 'authenticated');


-- 3. Gallery Bucket Policies (Public Read, Authenticated CRUD)
create policy "Public Read Gallery Images"
on storage.objects for select
using (bucket_id = 'gallery');

create policy "Authenticated Insert Gallery Images"
on storage.objects for insert
with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

create policy "Authenticated Update Gallery Images"
on storage.objects for update
using (bucket_id = 'gallery' and auth.role() = 'authenticated');

create policy "Authenticated Delete Gallery Images"
on storage.objects for delete
using (bucket_id = 'gallery' and auth.role() = 'authenticated');


-- 4. UMKM Bucket Policies (Public Read, Authenticated CRUD)
create policy "Public Read UMKM Images"
on storage.objects for select
using (bucket_id = 'umkm');

create policy "Authenticated Insert UMKM Images"
on storage.objects for insert
with check (bucket_id = 'umkm' and auth.role() = 'authenticated');

create policy "Authenticated Update UMKM Images"
on storage.objects for update
using (bucket_id = 'umkm' and auth.role() = 'authenticated');

create policy "Authenticated Delete UMKM Images"
on storage.objects for delete
using (bucket_id = 'umkm' and auth.role() = 'authenticated');


-- 5. Officials Bucket Policies (Public Read, Authenticated CRUD)
create policy "Public Read Officials Images"
on storage.objects for select
using (bucket_id = 'officials');

create policy "Authenticated Insert Officials Images"
on storage.objects for insert
with check (bucket_id = 'officials' and auth.role() = 'authenticated');

create policy "Authenticated Update Officials Images"
on storage.objects for update
using (bucket_id = 'officials' and auth.role() = 'authenticated');

create policy "Authenticated Delete Officials Images"
on storage.objects for delete
using (bucket_id = 'officials' and auth.role() = 'authenticated');


-- 6. Complaints Bucket Policies (Public Insert, Authenticated Internal Select/CRUD)
create policy "Public Insert Complaint Images"
on storage.objects for insert
with check (bucket_id = 'complaints');

create policy "Authenticated Internal Select Complaint Images"
on storage.objects for select
using (bucket_id = 'complaints' and auth.role() = 'authenticated');

create policy "Authenticated Internal Update Complaint Images"
on storage.objects for update
using (bucket_id = 'complaints' and auth.role() = 'authenticated');

create policy "Authenticated Internal Delete Complaint Images"
on storage.objects for delete
using (bucket_id = 'complaints' and auth.role() = 'authenticated');
