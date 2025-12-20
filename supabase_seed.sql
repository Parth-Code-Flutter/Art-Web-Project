-- Seed Data for Profiles and Artworks
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Create dummy users in auth.users (Required for Foreign Key constraint)
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'authenticated', 'authenticated', 'artist1@example.com', '$2a$10$dummyPasswordHashtoSatisfyAuth', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'authenticated', 'authenticated', 'artist2@example.com', '$2a$10$dummyPasswordHashtoSatisfyAuth', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. Create artists in profiles (Now safe to insert)
INSERT INTO profiles (id, email, username, role, avatar_url)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'artist1@example.com', 'ElenaV', 'seller', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'artist2@example.com', 'MarcusA', 'seller', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Sample Artworks
INSERT INTO artworks (title, description, artist_id, price, image_url, category, width, height, tags)
VALUES 
  (
    'Midnight Reflections', 
    'An abstract exploration of city lights reflecting on rain-slicked streets.', 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    1200.00, 
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800', 
    'Abstract', 
    100, 80, 
    ARRAY['dark', 'abstract', 'city', 'moody']
  ),
  (
    'Golden Horizon', 
    'A warm, texture-heavy piece depicting the break of dawn over a desert landscape.', 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    850.50, 
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800', 
    'Landscape', 
    120, 100, 
    ARRAY['gold', 'texture', 'warm', 'desert']
  ),
  (
    'Cybernetic Soul', 
    'Digital art fused with traditional texture techniques.', 
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 
    450.00, 
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', 
    'Digital', 
    60, 60, 
    ARRAY['digital', 'neon', 'futuristic']
  ),
  (
    'Urban Solitude', 
    'A lonely figure in a bustling metropolis.', 
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 
    3200.00, 
    'https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?w=800', 
    'Oil', 
    150, 150, 
    ARRAY['oil', 'city', 'realism', 'gray']
  );
