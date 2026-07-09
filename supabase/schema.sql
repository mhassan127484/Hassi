-- Hassi e-commerce schema
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- Profiles (1:1 with auth.users)
-- ─────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Categories
-- ─────────────────────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  blurb text not null default '',
  tile_hex text not null default '#111114',
  created_at timestamptz not null default now()
);

insert into categories (name, blurb, tile_hex) values
  ('Outerwear', 'Coats, jackets, shells', '#2B4CF0'),
  ('Knitwear', 'Sweaters, hoodies, cardigans', '#E4E7F5'),
  ('Denim', 'Jeans and trousers', '#2A2A30'),
  ('Footwear', 'Sneakers and boots', '#F2EEE6'),
  ('Accessories', 'Scarves, caps, belts', '#C9C2B4'),
  ('Bags', 'Totes, holdalls, crossbody', '#B5502D')
on conflict (name) do nothing;

-- ─────────────────────────────────────────────────────────────
-- Products + variants
-- ─────────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text not null default 'Hassi Standard',
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  category text not null,
  sizes text[] not null default '{}',
  stock int not null default 0,
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  drop_name text not null default 'Vol. 01',
  description text not null default '',
  highlights text[] not null default '{}',
  details jsonb not null default '{}',
  shipping text not null default '',
  returns text not null default '',
  tags text[] not null default '{}',
  status text not null default 'Active' check (status in ('Active', 'Draft', 'Archived')),
  created_at timestamptz not null default now()
);

create table if not exists product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  hex text not null default '#111114',
  image_url text,
  sort_order int not null default 0
);

create index if not exists product_colors_product_id_idx on product_colors(product_id);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);

create index if not exists product_images_product_id_idx on product_images(product_id);

-- ─────────────────────────────────────────────────────────────
-- Reviews
-- ─────────────────────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  title text not null default '',
  body text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_id_idx on reviews(product_id);

-- ─────────────────────────────────────────────────────────────
-- Addresses
-- ─────────────────────────────────────────────────────────────
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  address text not null,
  apartment text,
  city text not null,
  state text not null,
  zip text not null,
  country text not null default 'United States',
  phone text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on addresses(user_id);

-- ─────────────────────────────────────────────────────────────
-- Orders + line items
-- ─────────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  status text not null default 'Placed'
    check (status in ('Placed','Confirmed','Processing','Shipped','Out for Delivery','Delivered','Cancelled')),
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  shipping_method text not null default 'Standard',
  address jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_slug text not null,
  product_name text not null,
  price numeric(10,2) not null,
  color text not null,
  color_image_url text,
  size text not null,
  qty int not null default 1
);

create index if not exists orders_user_id_idx on orders(user_id);
create index if not exists order_items_order_id_idx on order_items(order_id);

-- ─────────────────────────────────────────────────────────────
-- Return requests
-- ─────────────────────────────────────────────────────────────
create table if not exists return_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_number text not null,
  item_name text not null,
  reason text not null,
  status text not null default 'Requested' check (status in ('Requested','Approved','Rejected')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Blog posts
-- ─────────────────────────────────────────────────────────────
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  excerpt text not null default '',
  body text[] not null default '{}',
  author text not null default 'Hassi Studio',
  published_at date not null default current_date,
  tile_image_url text,
  featured boolean not null default false
);

-- ─────────────────────────────────────────────────────────────
-- Newsletter
-- ─────────────────────────────────────────────────────────────
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table product_colors enable row level security;
alter table product_images enable row level security;
alter table reviews enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table return_requests enable row level security;
alter table blog_posts enable row level security;
alter table newsletter_subscribers enable row level security;

create or replace function is_admin()
returns boolean as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$ language sql security definer stable;

-- profiles: users read/update their own row; admins read all.
create policy "profiles_select_own_or_admin" on profiles for select using (auth.uid() = id or is_admin());
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- categories: public read; admin-only writes.
create policy "categories_public_read" on categories for select using (true);
create policy "categories_admin_write" on categories for all using (is_admin()) with check (is_admin());

-- products / product_colors: public read; admin-only writes.
create policy "products_public_read" on products for select using (true);
create policy "products_admin_write" on products for all using (is_admin()) with check (is_admin());
create policy "product_colors_public_read" on product_colors for select using (true);
create policy "product_colors_admin_write" on product_colors for all using (is_admin()) with check (is_admin());
create policy "product_images_public_read" on product_images for select using (true);
create policy "product_images_admin_write" on product_images for all using (is_admin()) with check (is_admin());

-- reviews: public read; signed-in users insert their own; owners or admins delete.
create policy "reviews_public_read" on reviews for select using (true);
create policy "reviews_insert_own" on reviews for insert with check (auth.uid() = user_id);
create policy "reviews_delete_own_or_admin" on reviews for delete using (auth.uid() = user_id or is_admin());

-- addresses: fully owned by the user.
create policy "addresses_own" on addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- orders: users see/create their own; admins see/update all.
create policy "orders_select_own_or_admin" on orders for select using (auth.uid() = user_id or is_admin());
create policy "orders_insert_own" on orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "orders_update_admin" on orders for update using (is_admin());

-- order_items: visible/insertable when the parent order is.
create policy "order_items_select" on order_items for select using (
  exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_admin()))
);
create policy "order_items_insert" on order_items for insert with check (
  exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or o.user_id is null))
);

-- return_requests: owned by the user; admins can read/update all.
create policy "returns_select_own_or_admin" on return_requests for select using (auth.uid() = user_id or is_admin());
create policy "returns_insert_own" on return_requests for insert with check (auth.uid() = user_id);
create policy "returns_update_admin" on return_requests for update using (is_admin());

-- blog_posts: public read; admin-only writes.
create policy "blog_public_read" on blog_posts for select using (true);
create policy "blog_admin_write" on blog_posts for all using (is_admin()) with check (is_admin());

-- newsletter: anyone can subscribe; no public read.
create policy "newsletter_insert_anyone" on newsletter_subscribers for insert with check (true);

-- ─────────────────────────────────────────────────────────────
-- Storage bucket for product photos
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_public_read" on storage.objects for select
  using (bucket_id = 'product-images');
create policy "product_images_admin_write" on storage.objects for all
  using (bucket_id = 'product-images' and is_admin())
  with check (bucket_id = 'product-images' and is_admin());

-- ─────────────────────────────────────────────────────────────
-- Make yourself an admin after signing up once through the app:
--   update profiles set is_admin = true where id = '<your-auth-user-uuid>';
-- ─────────────────────────────────────────────────────────────
