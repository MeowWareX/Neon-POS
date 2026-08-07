-- Migration: Add liquid_inventory and liquid_inventory_movements tables

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

-- Indexes for efficient queries
create index if not exists idx_liquid_inventory_flavor_name on public.liquid_inventory(flavor_name);
create index if not exists idx_liquid_movements_inventory_id on public.liquid_inventory_movements(liquid_inventory_id);
create index if not exists idx_liquid_movements_created_at on public.liquid_inventory_movements(created_at);

-- RLS Policies
alter table public.liquid_inventory enable row level security;
alter table public.liquid_inventory_movements enable row level security;

create policy "Allow read access to authenticated users"
  on public.liquid_inventory for select
  using (true);

create policy "Allow insert access to authenticated users"
  on public.liquid_inventory for insert
  with check (true);

create policy "Allow update access to authenticated users"
  on public.liquid_inventory for update
  using (true);

create policy "Allow delete access to authenticated users"
  on public.liquid_inventory for delete
  using (true);

create policy "Allow read access to movements for authenticated users"
  on public.liquid_inventory_movements for select
  using (true);

create policy "Allow insert access to movements for authenticated users"
  on public.liquid_inventory_movements for insert
  with check (true);

create policy "Allow update access to movements for authenticated users"
  on public.liquid_inventory_movements for update
  using (true);

create policy "Allow delete access to movements for authenticated users"
  on public.liquid_inventory_movements for delete
  using (true);
