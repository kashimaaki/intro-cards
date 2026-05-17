-- ① Supabase SQL Editor で実行してください

-- メンバーテーブル
create table if not exists members (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  university  text,
  gender      text,
  part        text,
  role        text,
  is_waseda   boolean default false,
  photo_url   text default '',
  created_at  timestamp with time zone default now()
);

-- Row Level Security を有効化（全員読み書き可）
alter table members enable row level security;

create policy "allow_all" on members
  for all using (true) with check (true);

-- ② Storage バケットの作成
-- Supabase Dashboard → Storage → New Bucket
--   Bucket name: photos
--   Public bucket: ON（チェックを入れる）

-- Storage のポリシー（SQL Editor で実行）
create policy "allow_storage_all"
  on storage.objects for all
  using ( bucket_id = 'photos' )
  with check ( bucket_id = 'photos' );
