create extension if not exists pgcrypto;

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.flavors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text,
  is_active boolean not null default true,
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
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

alter table public.extras
  add constraint if not exists extras_inventory_item_fk
  foreign key (inventory_item_id) references public.inventory_items(id);

create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_payment_method on public.orders(payment_method);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_active_flavors_business_date on public.active_flavors(business_date);
create index if not exists idx_inventory_movements_inventory_item on public.inventory_movements(inventory_item_id, created_at desc);
create index if not exists idx_cash_sessions_status on public.cash_sessions(status);
create index if not exists idx_expenses_created_at on public.expenses(created_at desc);
create index if not exists idx_loan_payments_created_at on public.loan_payments(created_at desc);

alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_item_extras enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.purchases enable row level security;
alter table public.cash_sessions enable row level security;
alter table public.expenses enable row level security;
alter table public.loan_payments enable row level security;
alter table public.flavors enable row level security;
alter table public.active_flavors enable row level security;
alter table public.product_sizes enable row level security;
alter table public.product_types enable row level security;
alter table public.products enable row level security;
alter table public.extras enable row level security;

create policy "authenticated can read core tables" on public.orders for select to authenticated using (true);
create policy "authenticated can insert orders" on public.orders for insert to authenticated with check (true);
create policy "authenticated can read order items" on public.order_items for select to authenticated using (true);
create policy "authenticated can insert order items" on public.order_items for insert to authenticated with check (true);
create policy "authenticated can read order item extras" on public.order_item_extras for select to authenticated using (true);
create policy "authenticated can insert order item extras" on public.order_item_extras for insert to authenticated with check (true);

create policy "authenticated can read support tables" on public.inventory_items for select to authenticated using (true);
create policy "authenticated can manage support tables" on public.inventory_items for all to authenticated using (true) with check (true);
create policy "authenticated can manage inventory movements" on public.inventory_movements for all to authenticated using (true) with check (true);
create policy "authenticated can manage purchases" on public.purchases for all to authenticated using (true) with check (true);
create policy "authenticated can manage cash sessions" on public.cash_sessions for all to authenticated using (true) with check (true);
create policy "authenticated can manage expenses" on public.expenses for all to authenticated using (true) with check (true);
create policy "authenticated can manage loan payments" on public.loan_payments for all to authenticated using (true) with check (true);
create policy "authenticated can manage users" on public.users for all to authenticated using (true) with check (true);
create policy "authenticated can manage flavors" on public.flavors for all to authenticated using (true) with check (true);
create policy "authenticated can manage active flavors" on public.active_flavors for all to authenticated using (true) with check (true);
create policy "authenticated can manage sizes" on public.product_sizes for all to authenticated using (true) with check (true);
create policy "authenticated can manage product types" on public.product_types for all to authenticated using (true) with check (true);
create policy "authenticated can manage products" on public.products for all to authenticated using (true) with check (true);
create policy "authenticated can manage extras" on public.extras for all to authenticated using (true) with check (true);
