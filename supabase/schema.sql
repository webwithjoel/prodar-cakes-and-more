create extension if not exists "pgcrypto";

create table if not exists categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  blurb text,
  image text,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists products (
  id text primary key,
  slug text unique not null,
  category_slug text not null references categories(slug),
  name text not null,
  short_description text,
  image text,
  base_price integer not null,
  price_label text not null default 'From',
  price_model text not null,
  customization jsonb not null default '{}'::jsonb,
  bulk_rules jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  fulfilment text not null,
  address text,
  needed_at timestamptz,
  note text,
  estimated_total integer not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  qty integer not null check (qty > 0),
  selections jsonb not null default '{}'::jsonb,
  line_total integer not null
);

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id)
);

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from admin_users
    where user_id = auth.uid()
  );
$$;

alter table categories enable row level security;
alter table products enable row level security;
alter table site_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table admin_users enable row level security;

drop policy if exists "public select active categories" on categories;
create policy "public select active categories" on categories
  for select using (is_active = true);

drop policy if exists "public select active products" on products;
create policy "public select active products" on products
  for select using (is_active = true);

drop policy if exists "public select site settings" on site_settings;
create policy "public select site settings" on site_settings
  for select using (true);

drop policy if exists "public insert orders" on orders;
create policy "public insert orders" on orders
  for insert with check (true);

drop policy if exists "public insert order items" on order_items;
create policy "public insert order items" on order_items
  for insert with check (true);

drop policy if exists "admin read categories" on categories;
create policy "admin read categories" on categories
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read products" on products;
create policy "admin read products" on products
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read settings" on site_settings;
create policy "admin read settings" on site_settings
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read orders" on orders;
create policy "admin read orders" on orders
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read order items" on order_items;
create policy "admin read order items" on order_items
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read admin users" on admin_users;
create policy "admin read admin users" on admin_users
  for all using (is_admin()) with check (is_admin());

-- Create a public Storage bucket named "product-images" in the Supabase dashboard.
-- Seed categories and products from src/data/categories.js and src/data/products.js
-- with the export-seed script instead of copying data into components.
