-- Migration: Add liquid_sales table for Concentrated Slush Machine Liquids

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

-- Index for date queries
create index if not exists idx_liquid_sales_sale_date on public.liquid_sales(sale_date);
create index if not exists idx_liquid_sales_created_at on public.liquid_sales(created_at);

-- RLS Policies
alter table public.liquid_sales enable row level security;

create policy "Allow read access to authenticated users"
  on public.liquid_sales for select
  using (true);

create policy "Allow insert access to authenticated users"
  on public.liquid_sales for insert
  with check (true);

create policy "Allow update access to authenticated users"
  on public.liquid_sales for update
  using (true);

create policy "Allow delete access to authenticated users"
  on public.liquid_sales for delete
  using (true);
