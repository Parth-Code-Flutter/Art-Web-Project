-- Create a table for managing shipping rules
create table if not exists shipping_rules (
  id uuid default gen_random_uuid() primary key,
  country text default 'All', -- 'All' or specific country code/name
  state text,                 -- Nullable, if null applies to entire country
  city text,                  -- Nullable, if null applies to entire state
  
  amount numeric not null default 0,
  currency text default 'INR',
  
  -- Future proofing columns
  min_weight numeric,         -- Optional: Minimum weight for this rule
  max_weight numeric,         -- Optional: Maximum weight for this rule
  estimated_days text,        -- e.g. "5-7 Business Days"
  
  -- Flexible JSON column for any extra logic needed later (e.g. carrier_id, express_flag)
  additional_params jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table shipping_rules enable row level security;

-- Create policies (Adjust these based on your auth needs)
-- Allow read access to everyone (so customers can see shipping rates)
create policy "Public can view shipping rules"
  on shipping_rules for select
  using (true);

-- Allow full access only to admins (authenticated users for now, or refine to admin/service role)
create policy "Admins can manage shipping rules"
  on shipping_rules for all
  using (auth.role() = 'authenticated'); -- You might want to restrict this to specific admin emails later
