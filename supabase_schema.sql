-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  username text unique,
  avatar_url text,
  role text default 'user', -- 'user', 'seller', 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Artworks Table
create table artworks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  artist_id uuid references profiles(id) not null,
  price numeric not null, -- Price in USD
  currency text default 'USD',
  image_url text not null,
  category text, -- 'Oil', 'Digital', etc.
  tags text[], -- Array of AI tags
  width numeric, -- Dimensions in cm
  height numeric,
  status text default 'available', -- 'available', 'sold'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Row Level Security (RLS) Policies
alter table profiles enable row level security;
alter table artworks enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- Policies for Artworks
create policy "Artworks are viewable by everyone." on artworks
  for select using (true);

create policy "Sellers can insert their own artworks." on artworks
  for insert with check (auth.uid() = artist_id);

create policy "Sellers can update their own artworks." on artworks
  for update using (auth.uid() = artist_id);

-- 4. Trigger to auto-create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, new.email); -- Default username to email initially
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
