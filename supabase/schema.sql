-- Users profile table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Diary entries table
create table if not exists public.diary_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  movie_id integer not null,
  movie_title text not null,
  poster_path text not null default '',
  rating smallint not null check (rating between 1 and 5),
  review text not null default '',
  watch_date date not null,
  mood text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Row-level security
alter table public.profiles enable row level security;
alter table public.diary_entries enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Diary entries: users can CRUD their own entries
create policy "Users can view own entries"
  on public.diary_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.diary_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.diary_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.diary_entries for delete
  using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create or replace trigger diary_entries_updated_at
  before update on public.diary_entries
  for each row execute function public.update_updated_at();

-- Indexes
create index if not exists diary_entries_user_id_idx on public.diary_entries(user_id);
create index if not exists diary_entries_watch_date_idx on public.diary_entries(user_id, watch_date desc);

-- Storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');
