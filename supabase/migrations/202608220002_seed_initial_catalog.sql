-- ==============================================================================
-- NEON OS - Initial Catalog & Products Seed
-- Migration: 202608220002_seed_initial_catalog.sql
-- Idempotent: Seeds product sizes, types, flavors, extras and active flavors.
-- ==============================================================================

-- 1. Product Sizes
insert into public.product_sizes (id, code, label, ounces, base_price, base_cost)
values
  ('33333333-1111-1111-1111-111111111111', '8oz', '8 oz', 8, 5000, 1500),
  ('33333333-2222-2222-2222-222222222222', '12oz', '12 oz', 12, 8000, 2600),
  ('33333333-3333-3333-3333-333333333333', '16oz', '16 oz', 16, 10000, 3400),
  ('33333333-3000-3000-3000-333333333333', '3k', 'Vasito 3K', 3, 3000, 1000),
  ('33333333-6000-6000-6000-333333333333', '6k', 'Mediano 6K', 6, 6000, 2000),
  ('33333333-9000-9000-9000-333333333333', '10k', 'Grande 10K', 10, 10000, 3500)
on conflict (code) do update set
  label = excluded.label,
  ounces = excluded.ounces,
  base_price = excluded.base_price,
  base_cost = excluded.base_cost;

-- 2. Product Types
insert into public.product_types (id, code, label, price_modifier, cost_modifier)
values
  ('44444444-1111-1111-1111-111111111111', 'basico', 'Básico', 0, 0),
  ('44444444-3333-3333-3333-333333333333', 'cremoso', 'Cremoso', 7000, 2000),
  ('44444444-4444-4444-4444-444444444444', 'picoso', 'Picoso', 5000, 1000),
  ('44444444-5555-5555-5555-555555555555', 'gomitas-enchilada', 'Gomitas Enchiladas', 0, 0)
on conflict (code) do update set
  label = excluded.label,
  price_modifier = excluded.price_modifier,
  cost_modifier = excluded.cost_modifier;

-- 3. Flavors
insert into public.flavors (id, name, color, is_active)
values
  ('55555555-1111-1111-1111-111111111111', 'Chicle', '#ff73e3', true),
  ('55555555-2222-2222-2222-222222222222', 'Sandía', '#3de8c2', true),
  ('55555555-3333-3333-3333-333333333333', 'Maracumango', '#ffd24d', true),
  ('55555555-4444-4444-4444-444444444444', 'Limón', '#7df97f', false),
  ('88888888-8888-8888-8888-888888888888', 'Enchilado / Directo', '#ff4500', true)
on conflict (name) do update set
  color = excluded.color,
  is_active = excluded.is_active;

-- 4. Active Flavors for Today
insert into public.active_flavors (flavor_id, business_date, tank_number)
values
  ('55555555-1111-1111-1111-111111111111', current_date, 1),
  ('55555555-2222-2222-2222-222222222222', current_date, 2),
  ('55555555-3333-3333-3333-333333333333', current_date, 3)
on conflict (business_date, tank_number) do update set
  flavor_id = excluded.flavor_id;

-- 5. Extras
insert into public.extras (id, name, price, cost)
values
  ('77777777-1111-1111-1111-111111111111', 'Gomitas', 1000, 300),
  ('77777777-2222-2222-2222-222222222222', 'Lecherita', 1000, 400),
  ('77777777-3333-3333-3333-333333333333', 'Tajín + Chamoy', 1000, 350)
on conflict (name) do update set
  price = excluded.price,
  cost = excluded.cost;
