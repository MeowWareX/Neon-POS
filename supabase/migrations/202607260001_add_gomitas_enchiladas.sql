-- Migration: Add Gomitas Enchiladas product type, sizes, and flavor

-- 1. Insert product type 'gomitas-enchilada'
insert into public.product_types (id, code, label, price_modifier, cost_modifier, inventory_item_id, usage_quantity)
values ('44444444-5555-5555-5555-555555555555', 'gomitas-enchilada', 'Gomitas Enchiladas', 0, 0, null, 1)
on conflict (code) do nothing;

-- 2. Insert product sizes for '3k', '6k', '10k'
insert into public.product_sizes (id, code, label, ounces, base_price, base_cost, inventory_item_id, usage_quantity)
values 
  ('33333333-3000-3000-3000-333333333333', '3k', 'Vasito 3K', 3, 3000, 1000, null, 1),
  ('33333333-6000-6000-6000-333333333333', '6k', 'Mediano 6K', 6, 6000, 2000, null, 1),
  ('33333333-9000-9000-9000-333333333333', '10k', 'Grande 10K', 10, 10000, 3500, null, 1)
on conflict (code) do nothing;

-- 3. Insert neutral flavor 'Enchilado / Directo'
insert into public.flavors (id, name, color, is_active, inventory_item_id)
values ('88888888-8888-8888-8888-888888888888', 'Enchilado / Directo', '#ff4500', true, null)
on conflict (name) do nothing;
