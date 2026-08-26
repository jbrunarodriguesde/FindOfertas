-- ==============================================================================
-- FINDOFERTAS - SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. TABLE: PROFILES
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null default '',
  email text not null default '',
  avatar_url text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles RLS
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- 3. TABLE: FAVORITES
-- ==============================================================================
create table if not exists public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  product_image text default '',
  store text default '',
  price numeric default 0,
  product_url text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

-- Favorites RLS
alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own favorites"
  on public.favorites for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- 4. TABLE: ALERTS
-- ==============================================================================
create table if not exists public.alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  product_image text default '',
  target_price numeric not null,
  current_price numeric default 0,
  current_effective_price numeric default 0,
  active boolean default true not null,
  notify_email boolean default true,
  notify_push boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Alerts RLS
alter table public.alerts enable row level security;

create policy "Users can view their own alerts"
  on public.alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own alerts"
  on public.alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own alerts"
  on public.alerts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own alerts"
  on public.alerts for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- 5. TABLE: SEARCH_HISTORY
-- ==============================================================================
create table if not exists public.search_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  query text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Search history RLS
alter table public.search_history enable row level security;

create policy "Users can view their own search history"
  on public.search_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own search history"
  on public.search_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own search history"
  on public.search_history for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- 6. TABLE: USER_PREFERENCES
-- ==============================================================================
create table if not exists public.user_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  preferred_stores text[] default '{}',
  preferred_categories text[] default '{}',
  preferred_payment_methods text[] default '{}',
  preferred_loyalty_programs text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Preferences RLS
alter table public.user_preferences enable row level security;

create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 7. TABLE: USER_CARDS (BENEFITS & CARDS SELECTION - NON-SENSITIVE)
-- ==============================================================================
create table if not exists public.user_cards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  card_identifier text not null, -- e.g. "card-c6-carbon" or custom card name
  name text not null,
  bank text not null default '',
  brand text not null default 'Mastercard',
  tier text not null default 'Standard',
  points_per_usd numeric default 0,
  cashback_rate numeric default 0,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Cards RLS
alter table public.user_cards enable row level security;

create policy "Users can view their own cards"
  on public.user_cards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cards"
  on public.user_cards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cards"
  on public.user_cards for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own cards"
  on public.user_cards for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER (AUTH.USERS -> PUBLIC.PROFILES)
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_full_name text;
  user_avatar text;
begin
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  user_avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    ''
  );

  insert into public.profiles (user_id, name, email, avatar_url)
  values (
    new.id,
    user_full_name,
    coalesce(new.email, ''),
    user_avatar
  )
  on conflict (user_id) do update
  set
    name = excluded.name,
    email = excluded.email,
    avatar_url = case when public.profiles.avatar_url = '' then excluded.avatar_url else public.profiles.avatar_url end,
    updated_at = timezone('utc'::text, now());

  -- Also create default empty user_preferences
  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 9. PERFORMANCE INDEXES
-- ==============================================================================
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_favorites_user_id on public.favorites(user_id);
create index if not exists idx_alerts_user_id on public.alerts(user_id);
create index if not exists idx_search_history_user_id on public.search_history(user_id);
create index if not exists idx_user_preferences_user_id on public.user_preferences(user_id);
create index if not exists idx_user_cards_user_id on public.user_cards(user_id);
