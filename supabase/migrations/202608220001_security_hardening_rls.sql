-- ==============================================================================
-- NEON OS - Security Hardening & Strict Role-Based Access Control (RBAC)
-- Migration: 202608220001_security_hardening_rls.sql
-- Idempotent & Safe: Creates any missing tables first, then applies strict RLS.
-- ==============================================================================

create extension if not exists pgcrypto;

-- 1. Ensure all tables exist before configuring security policies
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'operator')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  ounces integer not null,
  base_price numeric(12,2) not null,
  base_cost numeric(12,2) not null,
  inventory_item_id uuid,
  usage_quantity numeric(12,2) not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.product_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  price_modifier numeric(12,2) not null default 0,
  cost_modifier numeric(12,2) not null default 0,
  inventory_item_id uuid,
  usage_quantity numeric(12,2) not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.flavors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text,
  is_active boolean not null default true,
  inventory_item_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.active_flavors (
  id uuid primary key default gen_random_uuid(),
  flavor_id uuid not null references public.flavors(id),
  business_date date not null,
  tank_number smallint not null check (tank_number between 1 and 3),
  created_at timestamptz not null default now(),
  unique (business_date, tank_number),
  unique (business_date, flavor_id)
);

create table if not exists public.extras (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price numeric(12,2) not null,
  cost numeric(12,2) not null default 0,
  inventory_item_id uuid,
  usage_quantity numeric(12,2) not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  unit text not null,
  category text not null,
  current_stock numeric(12,2) not null default 0,
  reorder_point numeric(12,2) not null default 0,
  unit_cost numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.inventory_consumption_rules (
  id uuid primary key default gen_random_uuid(),
  product_type_id uuid references public.product_types(id),
  product_size_id uuid references public.product_sizes(id),
  extra_id uuid references public.extras(id),
  consumes_selected_flavor boolean not null default false,
  inventory_item_id uuid references public.inventory_items(id),
  quantity numeric(12,2) not null default 1,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_type_id, product_size_id, extra_id, inventory_item_id, consumes_selected_flavor)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.users(id),
  order_number text not null unique,
  payment_method text not null check (payment_method in ('cash', 'nequi', 'daviplata', 'transfer')),
  subtotal numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  estimated_cost numeric(12,2) not null default 0,
  sync_state text not null default 'synced' check (sync_state in ('local', 'pending', 'synced')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_size_id uuid not null references public.product_sizes(id),
  product_type_id uuid not null references public.product_types(id),
  flavor_id uuid not null references public.flavors(id),
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  unit_cost numeric(12,2) not null default 0,
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_item_extras (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  extra_id uuid not null references public.extras(id),
  created_at timestamptz not null default now(),
  unique (order_item_id, extra_id)
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items(id),
  movement_type text not null check (movement_type in ('sale', 'purchase', 'adjustment', 'waste')),
  quantity numeric(12,2) not null,
  note text,
  order_id uuid references public.orders(id),
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items(id),
  vendor text not null,
  quantity numeric(12,2) not null,
  total numeric(12,2) not null,
  note text,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.cash_sessions (
  id uuid primary key default gen_random_uuid(),
  opened_by uuid references public.users(id),
  opening_cash numeric(12,2) not null default 0,
  closing_cash numeric(12,2),
  expected_cash numeric(12,2),
  difference numeric(12,2),
  status text not null check (status in ('open', 'closed')) default 'open',
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  concept text not null,
  amount numeric(12,2) not null,
  category text not null,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.loan_payments (
  id uuid primary key default gen_random_uuid(),
  lender text not null,
  amount numeric(12,2) not null,
  balance_after_payment numeric(12,2) not null,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.liquid_sales (
  id uuid primary key default gen_random_uuid(),
  sale_date date not null default current_date,
  variant text not null check (variant in ('base_sin_licor', 'base_con_licor', 'cremoso_sin_licor', 'cremoso_con_licor')),
  flavor_id uuid references public.flavors(id),
  flavor_name text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  total numeric(12,2) not null check (total >= 0),
  payment_method text not null check (payment_method in ('cash', 'nequi', 'daviplata', 'transfer')),
  customer_name text,
  notes text,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.liquid_inventory (
  id uuid primary key default gen_random_uuid(),
  flavor_id uuid references public.flavors(id),
  flavor_name text not null,
  variant text check (variant in ('base_sin_licor', 'base_con_licor', 'cremoso_sin_licor', 'cremoso_con_licor')),
  current_stock integer not null default 0 check (current_stock >= 0),
  unit text not null default 'bolsa',
  min_stock integer not null default 2 check (min_stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.liquid_inventory_movements (
  id uuid primary key default gen_random_uuid(),
  liquid_inventory_id uuid not null references public.liquid_inventory(id) on delete cascade,
  movement_type text not null check (movement_type in ('production', 'sale', 'point_use', 'adjustment', 'waste')),
  quantity integer not null,
  notes text,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text unique not null,
  email text,
  stamps_count int default 0 check (stamps_count >= 0 and stamps_count <= 10),
  total_rewards_claimed int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.loyalty_passes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  wallet_type text not null check (wallet_type in ('web', 'google', 'apple')),
  pass_token text unique not null,
  push_token text,
  last_synced_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.loyalty_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  stamps_added int default 0,
  rewards_granted int default 0,
  reward_redeemed boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- 2. Helper functions for Role-Based Access Control (RBAC)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where auth_user_id = auth.uid()
      and role = 'admin'
      and deleted_at is null
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where auth_user_id = auth.uid()
      and role in ('admin', 'operator')
      and deleted_at is null
  );
$$;

-- 3. Safely drop all existing policies on public tables
do $$
declare
  r record;
begin
  for r in (
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
  ) loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- 4. Enable Row Level Security across all tables
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.product_sizes enable row level security;
alter table public.product_types enable row level security;
alter table public.flavors enable row level security;
alter table public.active_flavors enable row level security;
alter table public.extras enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_consumption_rules enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.purchases enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_item_extras enable row level security;
alter table public.cash_sessions enable row level security;
alter table public.expenses enable row level security;
alter table public.loan_payments enable row level security;
alter table public.liquid_sales enable row level security;
alter table public.liquid_inventory enable row level security;
alter table public.liquid_inventory_movements enable row level security;
alter table public.customers enable row level security;
alter table public.loyalty_passes enable row level security;
alter table public.loyalty_logs enable row level security;

-- 5. Define Secure Policies

-- USERS
create policy "users_self_read" on public.users
  for select to authenticated
  using (auth_user_id = auth.uid() or public.is_admin());

create policy "admins_manage_users" on public.users
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ORDERS & ORDER ITEMS
create policy "staff_read_orders" on public.orders
  for select to authenticated
  using (public.is_staff());

create policy "staff_insert_orders" on public.orders
  for insert to authenticated
  with check (public.is_staff());

create policy "admin_update_orders" on public.orders
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_delete_orders" on public.orders
  for delete to authenticated
  using (public.is_admin());

create policy "staff_read_order_items" on public.order_items
  for select to authenticated
  using (public.is_staff());

create policy "staff_insert_order_items" on public.order_items
  for insert to authenticated
  with check (public.is_staff());

create policy "admin_manage_order_items" on public.order_items
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "staff_read_order_item_extras" on public.order_item_extras
  for select to authenticated
  using (public.is_staff());

create policy "staff_insert_order_item_extras" on public.order_item_extras
  for insert to authenticated
  with check (public.is_staff());

create policy "admin_manage_order_item_extras" on public.order_item_extras
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- CASH SESSIONS, EXPENSES & LOANS
create policy "staff_manage_cash_sessions" on public.cash_sessions
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff_read_expenses" on public.expenses
  for select to authenticated
  using (public.is_staff());

create policy "staff_insert_expenses" on public.expenses
  for insert to authenticated
  with check (public.is_staff());

create policy "admin_manage_expenses" on public.expenses
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "staff_insert_loan_payments" on public.loan_payments
  for insert to authenticated
  with check (public.is_staff());

create policy "admin_manage_loan_payments" on public.loan_payments
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- INVENTORY & PURCHASES
create policy "staff_read_inventory_items" on public.inventory_items
  for select to authenticated
  using (public.is_staff());

create policy "admin_manage_inventory_items" on public.inventory_items
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "staff_read_consumption_rules" on public.inventory_consumption_rules
  for select to authenticated
  using (public.is_staff());

create policy "admin_manage_consumption_rules" on public.inventory_consumption_rules
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "staff_insert_inventory_movements" on public.inventory_movements
  for insert to authenticated
  with check (public.is_staff());

create policy "admin_manage_inventory_movements" on public.inventory_movements
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_manage_purchases" on public.purchases
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- CATALOG & FLAVORS
create policy "staff_read_flavors" on public.flavors
  for select to authenticated
  using (public.is_staff());

create policy "admin_manage_flavors" on public.flavors
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "staff_manage_active_flavors" on public.active_flavors
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff_read_product_sizes" on public.product_sizes
  for select to authenticated
  using (public.is_staff());

create policy "admin_manage_product_sizes" on public.product_sizes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "staff_read_product_types" on public.product_types
  for select to authenticated
  using (public.is_staff());

create policy "admin_manage_product_types" on public.product_types
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "staff_read_products" on public.products
  for select to authenticated
  using (public.is_staff());

create policy "admin_manage_products" on public.products
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "staff_read_extras" on public.extras
  for select to authenticated
  using (public.is_staff());

create policy "admin_manage_extras" on public.extras
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- LIQUID CONCENTRATES & INVENTORY
create policy "staff_read_liquid_sales" on public.liquid_sales
  for select to authenticated
  using (public.is_staff());

create policy "staff_insert_liquid_sales" on public.liquid_sales
  for insert to authenticated
  with check (public.is_staff());

create policy "admin_manage_liquid_sales" on public.liquid_sales
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "staff_manage_liquid_inventory" on public.liquid_inventory
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff_manage_liquid_movements" on public.liquid_inventory_movements
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- LOYALTY SYSTEM
create policy "staff_manage_customers" on public.customers
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff_manage_loyalty_passes" on public.loyalty_passes
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff_manage_loyalty_logs" on public.loyalty_logs
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

